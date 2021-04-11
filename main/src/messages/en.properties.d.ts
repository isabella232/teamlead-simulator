declare module "en.properties" {
    type Keys = {
        overlay: {
            intro: {
                header(arg: { team: string }): string;
                difficulty(arg: { difficulty: string }): string;
            }
        }
    }
    
    const def: Keys;
    export default def;
}