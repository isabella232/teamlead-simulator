import * as ts from "typescript";
import * as utils from "tsutils";
import {
    SimpleType,
    SimpleTypeKind,
    toSimpleType
} from "ts-simple-type";
import {readFileSync} from "fs";
import * as path from "path";

export interface Options {
}

export default function run_transformer(program: ts.Program, options: Options): ts.TransformerFactory<ts.Node> {
    const checker = program.getTypeChecker();
    const cyan = "\x1b[36m";
    const reset = "\x1b[0m";
    const bright = "\x1b[1m";
    const red = "\x1b[31m";

    function error_out(node: ts.Node, error: string) {
        const source = node.getSourceFile();
        const {line, character} = source.getLineAndCharacterOfPosition(node.getStart());
        throw new Error(`${bright}${red}ERROR${reset}: ${path.normalize(source.fileName)}:${line + 1} (${character + 1}) / ${error}`);
    }

    function resolve_alias(type: SimpleType): SimpleType {
        return type.kind == SimpleTypeKind.ALIAS ? type.target : type;
    }

    function file_to_string_literal(path_string: string, mode: string) {
        const config_file = (program.getCompilerOptions() as { configFilePath: string }).configFilePath;
        const project_directory = path.dirname(config_file);
        const resolved_path = path.resolve(project_directory, path_string);

        console.log("Reading", cyan, path.relative(process.cwd(), resolved_path), reset);

        return ts.createStringLiteral(readFileSync(resolved_path, mode));
    }

    function check_number_boolean_coercion(node: ts.Node) {
        const type = checker.getTypeAtLocation(node);
        const is_any = (type.flags & ts.TypeFlags.Any) != 0;
        if (is_any) {
            return;
        }

        if (utils.isTypeAssignableToNumber(checker, type)) {
            error_out(node, `Implicitly coercing number to boolean in expression '${node.getText()}', use != undefined instead`);
        } else if (utils.isUnionType(type)) {
            if (type.types.some(type => utils.isTypeAssignableToNumber(checker, type))) {
                error_out(node, `Implicitly coercing number to boolean in expression '${node.getText()}', use != undefined instead`);
            }
        }
    }

    function process_node(node: ts.Node): ts.Node | undefined {
        if (utils.isIfStatement(node)) {
            check_number_boolean_coercion(node.expression);
        } else if (utils.isBinaryExpression(node)) {
            if (node.operatorToken.kind == ts.SyntaxKind.AmpersandAmpersandToken || node.operatorToken.kind == ts.SyntaxKind.BarBarToken) {
                check_number_boolean_coercion(node.left);
                check_number_boolean_coercion(node.right);
            }
        } else if (utils.isPrefixUnaryExpression(node)) {
            if (node.operator == ts.SyntaxKind.ExclamationToken) {
                check_number_boolean_coercion(node.operand);
            }
        } else if (utils.isConditionalExpression(node)) {
            check_number_boolean_coercion(node.condition);
        } else if (utils.isCallExpression(node)) {
            const signature = checker.getResolvedSignature(node);
            const decl = signature.declaration;
            if (!decl) return;

            if (decl.kind == ts.SyntaxKind.FunctionDeclaration) {
                const function_name = decl.name.escapedText;

                if (function_name == "embed_base64") {
                    const argument = node.arguments[0];
                    const type = resolve_alias(toSimpleType(checker.getTypeAtLocation(argument), checker));

                    if (type.kind == SimpleTypeKind.STRING_LITERAL) {
                        return file_to_string_literal(type.value, "base64");
                    } else {
                        error_out(argument, "Only string literals are supported, " + type.kind + " given");
                    }
                } else if (function_name == "embed_file") {
                    const argument = node.arguments[0];
                    const type = resolve_alias(toSimpleType(checker.getTypeAtLocation(argument), checker));

                    if (type.kind == SimpleTypeKind.STRING_LITERAL) {
                        return file_to_string_literal(type.value, "utf8");
                    } else {
                        error_out(argument, "Only string literals are supported, " + type.kind + " given");
                    }
                }
            }

            return;
        }
    }

    function process_source_file(context: ts.TransformationContext, file: ts.SourceFile) {
        console.log("Processing", cyan, path.relative(process.cwd(), file.fileName), reset);

        function visitor(node: ts.Node): ts.Node {
            const new_node_or_nothing = process_node(node);

            if (new_node_or_nothing != undefined) {
                return new_node_or_nothing;
            }

            return ts.visitEachChild(node, visitor, context);
        }

        return ts.visitEachChild(file, visitor, context);
    }

    function process_and_update_source_file(context: ts.TransformationContext, file: ts.SourceFile) {
        const updated_node = process_source_file(context, file);

        return ts.updateSourceFileNode(
            file,
            updated_node.statements,
            updated_node.isDeclarationFile,
            updated_node.referencedFiles,
            updated_node.typeReferenceDirectives,
            updated_node.hasNoDefaultLib
        );
    }

    return context => (node: ts.Node) => {
        try {
            if (ts.isBundle(node)) {
                const new_files = node.sourceFiles.map(file => process_and_update_source_file(context, file));

                return ts.updateBundle(node, new_files);
            } else if (ts.isSourceFile(node)) {
                return process_and_update_source_file(context, node);
            }
        } catch (e) {
            console.log(e.message);
            // console.error(e);
            throw e;
        }

        return node;
    }
}