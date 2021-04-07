import en from "./messages/en.properties";
import ru from "./messages/ru.properties";

let i18n = ru;

type XY = { x: number, y: number }

type Mouse_State = {
    clicked: boolean
    button: number
    x: number
    y: number
    target_scroll_y: number
    scroll_y: number
}

const enum Button_State {
    default = 0,
    hovered = 1,
    clicked = 2
}

type Image_Resource = {
    img: HTMLImageElement
    loaded: boolean
}

const enum Layout_Type {
    vertical,
    horizontal,
    absolute
}

type Layout = {
    type: Layout_Type
    cursor: XY
}

type Font = {
    size: number
    weight: "normal" | "bold" | "bolder"
    mono: boolean
}

type Clip_Space = {
    path: Path2D
    fixed: false
} | {
    path: Path2D
    fixed: true
    fix_point: {
        x: number
        y: number
    }
}


enum Task_Status {
    new,
    in_development,
    in_review,
    in_testing,
    done
}

type Day_Of_Week = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type Game = {
    out: CanvasRenderingContext2D
    main_ctx: CanvasRenderingContext2D
    overlay_ctx: CanvasRenderingContext2D
    canvas_width: number
    canvas_height: number
    mouse: Mouse_State
    any_button_clicked_this_frame: boolean
    any_button_hovered_this_frame: boolean
    context_stack: CanvasRenderingContext2D[]
    layout_stack: Layout[]
    font_stack: Font[]
    clip_stack: WeakMap<CanvasRenderingContext2D, Clip_Space[]>
    time: number
    frame_time: number
    blur: number
    overlay_shown_at: number
    dpi_scale: number

    difficulty: Difficulty
    day: number
    deadline_day: number
    day_of_week: Day_Of_Week
    hour_of_day: number
    player: Player
    team: Teammate[]
    backlog: Task[]
    overlay: Overlay
    today_events: Calendar_Event[]
    inbox: Inbox_Entry[]
    current_app?: App
    apps: App[]
}

type Player = {
    burnout: number
    health: number
    company_status: number
    productivity: number
    attended_meetings_today: Calendar_Event_Type[]
}

type Teammate = {
    name: string
    name_genitive: string
    name_dative: string
    skill_level: number
    avatar: Image_Resource
    messages: Message[]
    skills: Skill[]
    skill_title: string
    messages_read: number
}

type Assignee = {
    you: true
} | {
    you: false
    teammate: Teammate
}

type Task_Base = {
    name: string
    full_name: string
    estimated_time: number
    time_spent: number
    required_skills: Skill[]
}

type Task = Task_Base & ({
    status: Task_Status.new
    estimated_time: number
} | {
    status: Task_Status.in_development
    remaining_work_hours: number
    developer_stuck_hours: number
    has_already_stuck_once: boolean
    assigned_to: Assignee
    bugs: number
    tests_written: boolean
    instructions_for_qa_written: boolean
} | {
    status: Task_Status.in_review
    assigned_to: Assignee
    bugs: number
    remaining_work_hours: number
    instructions_for_qa_written: boolean
} | {
    status: Task_Status.in_testing
    assigned_to: Assignee
    remaining_work_hours: number
    bugs: number
} | {
    status: Task_Status.done
    bugs: number
    can_backfire_on_prod: boolean
    defects_found_on_prod: boolean
})

enum Calendar_Event_Type {
    one_on_one,
    lead_meeting,
    candidate_interview,
    daily_standup,
    knowledge_sharing,
    lunch
}

type Calendar_Event_Base = {
    start_hour: number
    duration: number
}

type Calendar_Event = Calendar_Event_Base & ({
    type: Calendar_Event_Type.lead_meeting | Calendar_Event_Type.daily_standup | Calendar_Event_Type.lunch
} | {
    type: Calendar_Event_Type.knowledge_sharing
    topic: string
} | {
    type: Calendar_Event_Type.one_on_one
    teammate: Teammate
} | {
    type: Calendar_Event_Type.candidate_interview
    candidate_name: string
})

enum App_Type {
    code_junkie,
    limp,
    wrike,
    clndr,
    iron
}

type App_Base = {
    dock_hover_time: number
}

type App = App_Base & ({
    type: App_Type.code_junkie | App_Type.clndr | App_Type.iron
} | {
    type: App_Type.limp
    current_chat?: Teammate
} | {
    type: App_Type.wrike
    task_list_scroll_y: number
    inbox_scroll_y: number
})

type Message = {
    received_at_day_of_week: Day_Of_Week
    received_at_day: number
    received_at_hour: number
    text: string
}

type By_Type<Union, Type> = Union extends { type: Type } ? Union : never;
type By_Status<Union, Status> = Union extends { status: Status } ? Union : never;

enum Overlay_Type {
    none,
    lang,
    intro,
    standup_report,
    code_review,
    weekend,

    calendar_event_menu,
    message,
    editor_work_menu,
    computer_menu,
    task_menu,
    teammate_menu,
    website_menu,
    inbox_entry_menu,
    game_over
}

type Overlay = {
    type: Overlay_Type.none
} | {
    type: Overlay_Type.lang
} | {
    type: Overlay_Type.intro
} | {
    type: Overlay_Type.standup_report
    queue: Array<Teammate | undefined>
    random_verb_divisible: number
} | {
    type: Overlay_Type.code_review
    task: By_Status<Task, Task_Status.in_review>
} | {
    type: Overlay_Type.calendar_event_menu
    at: XY
    event: Calendar_Event
} | {
    type: Overlay_Type.message
    text: string
    next_overlay: Overlay
} | {
    type: Overlay_Type.editor_work_menu
} | {
    type: Overlay_Type.computer_menu
    at: XY
} | {
    type: Overlay_Type.task_menu
    at: XY
    task: Task
} | {
    type: Overlay_Type.teammate_menu
    teammate: Teammate
    at: XY
} | {
    type: Overlay_Type.website_menu
    website: Website
    at: XY
} | {
    type: Overlay_Type.inbox_entry_menu
    entry: Inbox_Entry
    at: XY
} | {
    type: Overlay_Type.weekend
} | {
    type: Overlay_Type.game_over
    reason: Game_Over_Reason
}

enum Skill {
    dart,
    typescript,
    javascript,
    java,
    sql,
    css
}

enum Website {
    jabr,
    you_cube
}

enum Difficulty {
    junior,
    middle,
    senior,
    teamlead
}

enum Inbox_Entry_Type {
    review_task,
    task_returned_to_dev,
    production_bug
}

type Inbox_Entry_Base = {
    received_at_hour: number
    received_at_day_of_week: Day_Of_Week
    read: boolean
}

type Inbox_Entry = Inbox_Entry_Base & ({
    type: Inbox_Entry_Type.review_task
    task: Task
} | {
    type: Inbox_Entry_Type.task_returned_to_dev
    task: Task
} | {
    type: Inbox_Entry_Type.production_bug
    task: By_Status<Task, Task_Status.done>
    hours_remaining: number
})

enum Game_Over_Reason {
    victory,
    deadline_failed,
    fired,
    bad_health,
    burnout
}

function all_skills() {
    return [
        Skill.dart,
        Skill.java,
        Skill.javascript,
        Skill.sql,
        Skill.typescript
    ];
}

function skill_name(skill: Skill): string {
    switch (skill) {
        case Skill.dart: return "Dart";
        case Skill.typescript: return "TS";
        case Skill.javascript: return "JS";
        case Skill.java: return "Java";
        case Skill.sql: return "SQL";
        case Skill.css: return "CSS";
    }
}

let game: Game;

const work_days = 5;
const week_days = 7;
const work_start_hour = 10;
const work_end_hour = 18;

const dev_mode = false;
const debug_clip = false;
const debug_buttons = false;

const image_cache: Map<string, Image_Resource> = new Map();

function embed_base64(from_path: string): string {
    return from_path;
}

declare function unreachable(x: never): never;

function xy(x: number, y: number): XY {
    return { x, y };
}

function image_from_url(url: string): Image_Resource {
    const resource = image_cache.get(url);

    if (resource) {
        return resource;
    }

    const new_resource: Image_Resource = {
        img: new Image(),
        loaded: false
    };

    new_resource.img.onload = () => new_resource.loaded = true;
    new_resource.img.src = url;

    image_cache.set(url, new_resource);

    return new_resource;
}

function pluralize_ru(x: number, one: string, two: string, five: string) {
    x = Math.floor(Math.abs(x)) % 100;

    if (x > 10 && x < 20) {
        return five;
    }

    x = x % 10;

    if (x == 1) {
        return one;
    }

    if (x >= 2 && x <= 4) {
        return two;
    }

    return five;
}

function contains(x: number, y: number, sx: number, sy: number, width: number, height: number) {
    return x >= sx && y >= sy && x < sx + width && y < sy + height;
}

function point_to_screen_space(x: number, y: number): XY {
    const p = point_to_world_space(x, y);
    return xy(p.x / game.dpi_scale, p.y / game.dpi_scale);
}

function point_to_world_space(x: number, y: number): XY {
    const p = current_context().getTransform().transformPoint({ x: x, y: y });
    return xy(p.x, p.y);
}

function mouse_can_interact_with_area(top_left_x: number, top_left_y: number, width: number, height: number): boolean {
    const clip = current_clip();

    if (debug_buttons) {
        const cursor = point_to_screen_space(0, 0);

        push_context(game.overlay_ctx);
        const ctx = current_context();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.strokeRect(cursor.x + top_left_x, cursor.y + top_left_y, width, height);
        pop_context();
    }

    if (clip) {
        const check_x = game.mouse.x;
        const check_y = game.mouse.y;

        let is_in_clip: boolean;
        if (clip.fixed) {
            const ctx = current_context();
            const old = ctx.getTransform();
            ctx.resetTransform();
            ctx.translate(clip.fix_point.x, clip.fix_point.y);
            is_in_clip = current_context().isPointInPath(clip.path, check_x, check_y);
            ctx.setTransform(old);
        } else {
            // TODO Figure out what's wrong with this one
            // is_in_clip = current_context().isPointInPath(clip.path, check_x, check_y);
            is_in_clip = true;
        }

        if (!is_in_clip) return false;
    }

    const cursor = point_to_screen_space(0, 0);
    return contains(game.mouse.x, game.mouse.y, cursor.x + top_left_x, cursor.y + top_left_y, width, height);
}

function button_behavior(top_left_x: number, top_left_y: number, width: number, height: number): Button_State {
    const hovered = mouse_can_interact_with_area(top_left_x, top_left_y, width, height);

    if (hovered && !game.any_button_hovered_this_frame) {
        game.any_button_hovered_this_frame = true;

        if (!game.any_button_clicked_this_frame && was_button_clicked(0)) {
            game.any_button_clicked_this_frame = true;

            return Button_State.clicked;
        } else {
            return Button_State.hovered;
        }
    }

    return Button_State.default;
}

function do_button(text: string, top_left_x: number, top_left_y: number, font_size_px: number, padding: number): Button_State {
    const ctx = current_context();

    ctx.font = `${font_size_px}px Open Sans`;

    const text_width = ctx.measureText(text).width;
    const button_width = padding + text_width + padding;
    const button_height = padding + font_size_px + padding;

    const state = button_behavior(top_left_x, top_left_y, button_width, button_height);

    ctx.fillStyle = state == Button_State.hovered ? "#a4c7c2" : "#d0d0d0";
    ctx.fillRect(top_left_x, top_left_y, button_width, button_height);

    ctx.fillStyle = "black";
    ctx.fillText(text, top_left_x + padding, top_left_y + padding + font_size_px / 2);

    return state;
}

function label(text: string) {
    const ctx = current_context();
    const font = game.font_stack[game.font_stack.length - 1];
    const xy = layout_cursor();

    ctx.fillText(text, xy.x, xy.y + font.size / 2);
    push_size(font.size + 4);
}

function text_to_lines(text: string, wrap_at: number): string[] {
    const paragraphs = text.split("\n");
    const lines: string[] = [];

    for (const paragraph of paragraphs) {
        const words = paragraph.split(" ");

        let line = words[0];

        const ctx = current_context();

        for (let index = 1; index < words.length; index++) {
            const word = words[index];
            const width = ctx.measureText(line + " " + word).width;
            if (width < wrap_at) {
                line += " " + word;
            } else {
                lines.push(line);
                line = word;
            }
        }

        lines.push(line);
    }

    return lines;
}

function text(text: string, wrap_width: number) {
    for (const line of text_to_lines(text, wrap_width)) {
        label(line);
    }
}

function button(text: string) {
    const padding = 8;
    const font_size_px = 18;
    const xy = layout_cursor();
    const state = do_button(text, xy.x, xy.y, font_size_px, padding) == Button_State.clicked;
    push_size(padding + font_size_px + padding);
    push_size(4);
    return state;
}

function was_button_clicked(button: number) {
    return game.mouse.button == button && game.mouse.clicked;
}

function layout_cursor() {
    return game.layout_stack[game.layout_stack.length - 1].cursor;
}

function set_layout_cursor(x: number, y: number) {
    const cursor = layout_cursor();
    cursor.x = x;
    cursor.y = y;
}

function push_layout(type: Layout_Type) {
    const current = game.layout_stack[game.layout_stack.length - 1];

    game.layout_stack.push({
        type: type,
        cursor: xy(current.cursor.x, current.cursor.y)
    })
}

function pop_layout() {
    game.layout_stack.pop();
}

function update_font() {
    const font = game.font_stack[game.font_stack.length - 1];
    current_context().font = `${font.weight} ${font.size}px ${font.mono ? "monospace" : "sans-serif"}`;
}

function push_font(size: number, weight: "normal" | "bold" | "bolder" = "normal", mono = false) {
    game.font_stack.push({ size: size, weight: weight, mono: mono });
    update_font();
}

function pop_font() {
    game.font_stack.pop();
    update_font();
}

function push_context(ctx: CanvasRenderingContext2D) {
    game.context_stack.push(ctx);
}

function pop_context() {
    game.context_stack.pop();
}

function current_context(): CanvasRenderingContext2D {
    return game.context_stack[game.context_stack.length - 1];
}

function push_clip(path: Path2D, fixed = false) {
    const ctx = current_context();
    ctx.save();

    if (debug_clip) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.stroke(path);
    }

    ctx.clip(path);

    const stack = game.clip_stack.get(ctx);
    const clip_space: Clip_Space = fixed ?
        { fixed: fixed, path: path, fix_point: point_to_screen_space(0, 0) } :
        { fixed: fixed, path: path };

    if (!stack) {
        game.clip_stack.set(ctx, [clip_space]);
    } else {
        stack.push(clip_space);
    }
}

function pop_clip() {
    const ctx = current_context();
    const stack = game.clip_stack.get(ctx);

    if (stack) {
        stack.pop();
    }

    ctx.restore();
}

function current_clip(): Clip_Space | undefined {
    const ctx = current_context();
    const stack = game.clip_stack.get(ctx);

    if (stack && stack.length > 0) {
        return stack[stack.length - 1];
    }
}

function push_size(size: number) {
    function increment_size(layout: Layout) {
        switch (layout.type) {
            case Layout_Type.horizontal: {
                layout.cursor.x += size;
                break;
            }

            case Layout_Type.vertical: {
                layout.cursor.y += size;
                break;
            }

            case Layout_Type.absolute: break;

            default: unreachable(layout.type);
        }
    }

    for (let index = game.layout_stack.length - 1; index >= 0; index--) {
        const top = game.layout_stack[game.layout_stack.length - 1];
        const current = game.layout_stack[index];

        if (top.type == current.type) {
            increment_size(current);
        }
    }
}

function show_overlay(overlay: Overlay) {
    if (game.overlay.type == Overlay_Type.game_over) {
        return;
    }

    if (overlay.type == Overlay_Type.game_over) {
        close_current_app();
    }

    game.overlay = overlay;
    game.overlay_shown_at = game.time;
}

function receive_message_from(teammate: Teammate, text: string, skip_greeting = false) {
    const any_messages_today = teammate.messages.some(message => message.received_at_day == game.day);

    if (!any_messages_today && !skip_greeting) {
        const greetings = [
            "Привет",
            "Прив",
            "Хай",
            "Даров",
            "Здоровеньки булы"
        ];

        teammate.messages.push({
            received_at_day: game.day,
            received_at_hour: game.hour_of_day,
            text: random_in_array(greetings) + random_in_array(["", "!"]),
            received_at_day_of_week: game.day_of_week
        });
    }

    teammate.messages.push({
        received_at_day: game.day,
        received_at_hour: game.hour_of_day,
        received_at_day_of_week: game.day_of_week,
        text: text
    })
}

function base64_image(base64: string) {
    return image_from_url(`data:image/png;base64,${base64}`)
}

const images = {
    logo_pear: image_from_url(embed_base64("images/pear.png")),
    icon_app_code_junkie: image_from_url(embed_base64("images/code_junkie.png")),
    icon_app_limp: image_from_url(embed_base64("images/limp.png")),
    icon_app_wrike: image_from_url(embed_base64("images/wrike.png")),
    icon_app_clndr: image_from_url(embed_base64("images/clndr.png")),
    icon_app_iron: image_from_url(embed_base64("images/iron.png")),
    icon_web_you_cube: image_from_url(embed_base64("images/you_cube.png")),
    icon_web_jabr: image_from_url(embed_base64("images/jabr.png")),
    background_day: image_from_url(embed_base64("images/mojave-day.jpg")),
    background_night: image_from_url(embed_base64("images/mojave-night.jpg")),
    logo_wrike: image_from_url(embed_base64("images/wrike_full.png")),
    logo_iron_big: image_from_url(embed_base64("images/iron_big_logo.png")),
    default_avatar: image_from_url(embed_base64("images/default_avatar.png")),
    people: [
        image_from_url(embed_base64("images/people/1.jpg")),
        image_from_url(embed_base64("images/people/2.jpg")),
        image_from_url(embed_base64("images/people/3.jpg")),
        image_from_url(embed_base64("images/people/4.jpg")),
        image_from_url(embed_base64("images/people/5.jpg")),
        image_from_url(embed_base64("images/people/6.jpg")),
        image_from_url(embed_base64("images/people/7.jpg")),
        image_from_url(embed_base64("images/people/8.jpg"))
    ]
};

const tokens = draw_code_editor.toString().split("\n").map(tokenize_code);

function app_icon(app: App_Type): Image_Resource {
    switch (app) {
        case App_Type.code_junkie: return images.icon_app_code_junkie;
        case App_Type.limp: return images.icon_app_limp;
        case App_Type.wrike: return images.icon_app_wrike;
        case App_Type.clndr: return images.icon_app_clndr;
        case App_Type.iron: return images.icon_app_iron;
    }
}

const enum Token_Kind {
    code,
    keyword,
    number,
    string,
    comment
}

type Token = {
    kind: Token_Kind
    text: string
}

function difficulty_name(difficulty: Difficulty): string {
    switch (difficulty) {
        case Difficulty.junior: return "Джуниор";
        case Difficulty.middle: return "Мидл";
        case Difficulty.senior: return "Сеньор";
        case Difficulty.teamlead: return "Тимлид";
    }
}

function tokenize_code(line: string): Token[] {
    const tokens: Token[] = [];

    let in_string = false;
    let previous = "";
    let current_token_start = 0;
    let current_word_start = 0;
    let index = 0

    function push_token(kind: Token_Kind, text: string) {
        tokens.push({
            kind: kind,
            text: text
        });

        current_word_start = index;
        current_token_start = index;
    }

    const keywords = [";", "const", "let", "function", "if"];

    function push_remains(text: string) {
        if (text.length == 0) return;

        if (keywords.includes(text)) {
            push_token(Token_Kind.keyword, text);
        } else if (/^\d+$/.test(text)) {
            push_token(Token_Kind.number, text);
        } else {
            push_token(Token_Kind.code, text);
        }
    }

    for (index = 0; index < line.length; index++) {
        const char = line[index];

        const token_text = line.substring(current_token_start, index);

        if (char == "/" && previous == "/") {
            push_remains(line.substring(current_token_start, index - 1))
            push_token(Token_Kind.comment, line.substring(index - 1))
            return tokens;
        }

        if (in_string) {
            if (char == "\"") {
                index++;
                push_token(Token_Kind.string, line.substring(current_token_start, index));
                in_string = false;
            }
        } else {
            const until_word = line.substring(current_token_start, current_word_start);
            const word = line.substring(current_word_start, index);

            if (keywords.includes(word)) {
                push_remains(until_word);
                push_token(Token_Kind.keyword, word);
            } else if (/^\d+$/.test(word)) {
                push_remains(until_word);
                push_token(Token_Kind.number, word);
            }

            if (char == " " || char == "(" || char == ")" || char == ",") {
                current_word_start = index + 1;
            }

            if (char == "\"") {
                push_remains(token_text);
                in_string = true;
            }
        }

        previous = char;
    }

    push_remains(line.substring(current_token_start));

    return tokens;
}

function find_free_assignee(): Assignee | undefined {
    for (const teammate of game.team) {
        if (!find_first_assigned_task_in_dev(teammate)) {
            return {
                you: false,
                teammate: teammate
            }
        }
    }

    if (!find_your_first_current_task_in_dev()) {
        return { you: true };
    }
}

function all_tasks(): Task[] {
    return game.backlog;
}

function free_tasks(): By_Status<Task, Task_Status.new>[] {
    const free: By_Status<Task, Task_Status.new>[] = [];

    for (const task of all_tasks()) if (task.status == Task_Status.new) free.push(task);

    return free;
}

function tasks_not_done() {
    return all_tasks().filter(task => task.status != Task_Status.done).length;
}

function change_task(task: Task, new_state: Task) {
    Object.assign(task, new_state);
}

function assign_task(task: By_Status<Task, Task_Status.new>, assignee: Assignee) {
    const skills_non_possessed = assignee.you ? 0 : task.required_skills.filter(skill => assignee.teammate.skills.includes(skill)).length;

    change_task(task, {
        ...task,
        status: Task_Status.in_development,
        assigned_to: assignee,
        remaining_work_hours: task.estimated_time + skills_non_possessed * 2,
        developer_stuck_hours: 0,
        bugs: 0,
        tests_written: false,
        instructions_for_qa_written: false,
        has_already_stuck_once: false
    });
}

function pass_task_to_review(task: By_Status<Task, Task_Status.in_development>) {
    change_task(task, {
        ...task,
        status: Task_Status.in_review,
        remaining_work_hours: 8
    });
}

function return_task_from_review_to_development(task: By_Status<Task, Task_Status.in_review>, found_bugs: number) {
    for (const entry of game.inbox) {
        if (entry.type == Inbox_Entry_Type.review_task && entry.task == task) {
            entry.read = true;
        }
    }

    change_task(task, {
        ...task,
        status: Task_Status.in_development,
        developer_stuck_hours: 0,
        remaining_work_hours: found_bugs,
        tests_written: false,
        instructions_for_qa_written: false,
        bugs: task.bugs - found_bugs,
        has_already_stuck_once: false
    })
}

function return_task_from_qa_to_development(task: By_Status<Task, Task_Status.in_testing>, found_bugs: number) {
    change_task(task, {
        ...task,
        status: Task_Status.in_development,
        developer_stuck_hours: 0,
        remaining_work_hours: found_bugs,
        tests_written: false,
        instructions_for_qa_written: false,
        bugs: task.bugs - found_bugs,
        has_already_stuck_once: false
    });

    game.inbox.push({
        type: Inbox_Entry_Type.task_returned_to_dev,
        received_at_day_of_week: game.day_of_week,
        received_at_hour: game.hour_of_day,
        task: task,
        read: false
    });
}

function pass_task_to_qa(task: By_Status<Task, Task_Status.in_review>, work_hours: number) {
    for (const entry of game.inbox) {
        if (entry.type == Inbox_Entry_Type.review_task && entry.task == task) {
            entry.read = true;
        }
    }

    change_task(task, {
        ...task,
        status: Task_Status.in_testing,
        remaining_work_hours: work_hours,
    });
}

function deploy_task(task: By_Status<Task, Task_Status.in_testing>) {
    change_task(task, {
        ...task,
        status: Task_Status.done,
        can_backfire_on_prod: Math.random() > 0.3,
        defects_found_on_prod: false
    });

    if (game.backlog.every(task => task.status == Task_Status.done)) {
        show_overlay({ type: Overlay_Type.game_over, reason: Game_Over_Reason.victory });
    }
}

function is_work_time() {
    return game.hour_of_day >= work_start_hour && game.hour_of_day < work_end_hour && game.day_of_week <= work_days;
}

function increase_burnout_if_working_past_work_time() {
    if (!is_work_time()) {
        game.player.burnout = Math.min(100, game.player.burnout + 5);

        if (game.player.burnout == 100) {
            show_overlay({ type: Overlay_Type.game_over, reason: Game_Over_Reason.burnout });
        }
    }
}

function increase_health(by_how_much: number) {
    game.player.health = Math.min(game.player.health + by_how_much, 100);
}

function path_rounded_rect(x: number, y: number, w: number, h: number, r: number): Path2D {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;

    const path = new Path2D();

    path.moveTo(x + r, y);
    path.arcTo(x + w, y, x + w, y + h, r);
    path.arcTo(x + w, y + h, x, y + h, r);
    path.arcTo(x, y + h, x, y, r);
    path.arcTo(x, y, x + w, y, r);

    return path;
}

function path_circle(x: number, y: number, r: number) {
    const ctx = current_context();

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
}

function draw_line(color: string, width: number, x1: number, y1: number, x2: number, y2: number) {
    const ctx = current_context();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

function fill_circle(color: string, x: number, y: number, r: number) {
    const ctx = current_context();
    ctx.fillStyle = color;
    path_circle(x, y, r);
    ctx.fill();
}

// https://stackoverflow.com/questions/6443990/javascript-calculate-brighter-colour
function increase_brightness(hex: string, percent: number){
    hex = hex.startsWith("#") ? hex.substring(1) : hex;;

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length == 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }

    const r = parseInt(hex.substr(0, 2), 16),
          g = parseInt(hex.substr(2, 2), 16),
          b = parseInt(hex.substr(4, 2), 16);

    return '#' +
        ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
        ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
        ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}

function status_color(status: Task_Status): string {
    switch (status) {
        case Task_Status.new: return "#2196F3"
        case Task_Status.in_development: return "#00BCD4"
        case Task_Status.in_review: return "#009688"
        case Task_Status.in_testing: return "#FFEB3B"
        case Task_Status.done: return "#8BC34A"
    }
}

function status_title(status: Task_Status): string {
    switch (status) {
        case Task_Status.new: return "New"
        case Task_Status.in_development: return "In development"
        case Task_Status.in_review: return "Review is required"
        case Task_Status.in_testing: return "Testing in progress"
        case Task_Status.done: return "Deployed"
    }
}

function mark_current_chat_as_read(app: By_Type<App, App_Type.limp>) {
    if (app.current_chat) {
        app.current_chat.messages_read = app.current_chat.messages.length;
    }
}

function draw_messenger(app: By_Type<App, App_Type.limp>, width: number, height: number) {
    const chat_list_background = "#3F0E40";
    const offline_chat_color = "#896B89";
    const read_chat_name = "#B39FB3";
    const unread_chat_name = "#fff";
    const notifications_bubble_background = "#E01E5A";
    const online_bubble_background = "#2BAC76";
    const selected_chat_background = "#1164A3";
    const hovered_chat_background = "#350D36";
    const chat_list_top_underline = "#FFFFFF1A";

    const text_color = "#1D1C1D";
    const subtext_color = "#6B6A6B";
    const offline_chat_top = "#606060";

    const top_bar_height = 64;
    const chat_list_width = 200;

    const message_input_height = 40;
    const message_input_bottom_margin = 24;

    const ctx = current_context();

    const padding = 27;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = chat_list_background;
    ctx.fillRect(0, 0, chat_list_width, height);

    push_font(15);

    push_font(15, "bold");
    ctx.fillStyle = "#fff";
    ctx.fillText("Chats", padding - 8, top_bar_height / 2);
    pop_font();

    ctx.fillStyle = read_chat_name;
    ctx.fillText("Direct Messages", padding - 8, top_bar_height + 25);

    draw_line(chat_list_top_underline, 1, 0.5, top_bar_height, chat_list_width - 0.5, top_bar_height);

    let offset_y = 0;

    const chat_height = 30;

    const status_bubble_r = 5;

    function draw_status_bubble(x: number, y: number, online: boolean, selected: boolean) {
        path_circle(x, y, status_bubble_r);

        if (online) {
            ctx.fillStyle = selected ? unread_chat_name : online_bubble_background;
            ctx.fill();
        } else {
            ctx.strokeStyle = selected ? unread_chat_name : offline_chat_color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    for (const teammate of game.team) {
        const center_y = top_bar_height + 55 + offset_y;
        const top_y = center_y - chat_height / 2;

        const state = button_behavior(0, top_y, chat_list_width, chat_height);
        const selected = app.current_chat == teammate;
        const hovered = state == Button_State.hovered;

        if (selected || hovered) {
            ctx.fillStyle = selected ? selected_chat_background : hovered_chat_background;
            ctx.fillRect(0.5, top_y, chat_list_width - 1, chat_height);
        }

        draw_status_bubble(padding + status_bubble_r, center_y, is_work_time(), selected);

        if (is_work_time()) {
            ctx.fillStyle = selected ? unread_chat_name : read_chat_name;
        } else {
            ctx.fillStyle = selected ? unread_chat_name : offline_chat_color;
        }

        ctx.fillText(teammate.name, padding + status_bubble_r * 2 + 7, center_y);

        if (state == Button_State.clicked) {
            mark_current_chat_as_read(app);
            app.current_chat = teammate;
            mark_current_chat_as_read(app);
        }

        const unread_messages = teammate.messages.length - teammate.messages_read;

        if (unread_messages > 0) {
            const unread_width = 24;
            const unread_height = 20;

            const unread_x = chat_list_width - padding - unread_width;
            const unread_y = center_y - unread_height / 2;

            const rect = path_rounded_rect(unread_x, unread_y, unread_width, unread_height, 14);

            ctx.fillStyle = notifications_bubble_background;
            ctx.fill(rect);

            push_font(15, "bold");
            const text = unread_messages.toString(10);
            const text_width = ctx.measureText(text).width;
            ctx.fillStyle = unread_chat_name;
            ctx.fillText(text, unread_x + unread_width / 2 - text_width / 2, center_y);
            pop_font();
        }

        offset_y += chat_height;
    }

    pop_font();

    { // Message area top bar
        const top_bar_underline = "#E2E2E2";

        draw_line(top_bar_underline, 1, chat_list_width + 0.5, top_bar_height, width - 0.5, top_bar_height);

        push_font(15, "bold");

        if (app.current_chat) {
            const online = is_work_time();
            const x = chat_list_width + padding;
            const y = top_bar_height / 2;

            draw_status_bubble(x, y, online, false);

            ctx.fillStyle = online ? "#000" : offline_chat_top;

            const name_width = ctx.measureText(app.current_chat.name).width;
            const name_x = x + status_bubble_r * 2 + 4;
            ctx.fillText(app.current_chat.name, name_x, y);

            const title_x = name_x + name_width + 12;
            push_font(15);
            ctx.fillStyle = subtext_color;
            ctx.fillText(app.current_chat.skill_title, title_x, y);
            pop_font();
        }

        pop_font();
    }

    if (app.current_chat) { // Messages
        const message_x = chat_list_width + padding;
        const messages_pane_width = width - chat_list_width - 0.5;
        const message_area_width = width - padding - message_x;

        const rect = new Path2D();
        rect.rect(chat_list_width + 0.5, top_bar_height + 0.5, messages_pane_width, height - top_bar_height - 0.5);
        push_clip(rect);

        const messages = app.current_chat.messages;

        let message_bottom_y = height - message_input_height - message_input_bottom_margin - 8;

        for (const message of [...messages].reverse()) {
            push_font(15);
            ctx.textBaseline = "top";

            const avatar_side = 36;
            const avatar_margin = 8;

            const lines_x = message_x + avatar_side + avatar_margin;
            const line_area_width = message_area_width - avatar_side - avatar_margin;
            const lines = text_to_lines(message.text, line_area_width);
            const line_height = 20;
            const message_header_height = line_height;
            const message_height = lines.length * line_height + message_header_height + 8;
            const message_top_y = message_bottom_y - message_height;
            const lines_y = message_top_y + message_header_height;

            { // Avatar
                const rect = path_rounded_rect(message_x, message_top_y, avatar_side, avatar_side, 6);
                push_clip(rect);

                ctx.drawImage(app.current_chat.avatar.img, message_x, message_top_y, avatar_side, avatar_side);

                pop_clip();
            }

            { // Name and time
                // Name
                push_font(15, "bold");

                const name_width = ctx.measureText(app.current_chat.name).width;

                ctx.fillStyle = text_color;
                ctx.fillText(app.current_chat.name, lines_x, message_top_y);

                pop_font();

                // Time
                push_font(12);

                const time_text = `${hour_string(message.received_at_hour)}, ${day_of_week_name(message.received_at_day_of_week)}`;

                ctx.fillStyle = subtext_color;
                ctx.fillText(time_text, lines_x + name_width + 4, message_top_y + 2);

                pop_font();
            }

            { // Message lines
                ctx.fillStyle = text_color;

                for (let index = 0; index < lines.length; index++) {
                    ctx.fillText(lines[index], lines_x, lines_y + line_height * index);
                }
            }

            message_bottom_y -= message_height;

            ctx.textBaseline = "middle";
            pop_font();
        }

        pop_clip();
    }

    if (app.current_chat) { // Message input
        const message_input_outline = "#8E8D8E";
        const placeholder_text_color = "#C8C8C8";

        const top_left_x = chat_list_width + padding;
        const top_left_y = height - message_input_height - message_input_bottom_margin;

        const input_width = width - top_left_x - padding;

        const rect = path_rounded_rect(top_left_x, top_left_y, input_width, message_input_height, 4);
        ctx.strokeStyle = message_input_outline;
        ctx.lineWidth = 1;
        ctx.stroke(rect);

        if (app.current_chat) {
            push_font(15);

            ctx.fillStyle = placeholder_text_color;
            ctx.fillText(`Написать ${app.current_chat.name_dative}`, top_left_x + 12, top_left_y + message_input_height / 2);

            pop_font();

            if (button_behavior(top_left_x, top_left_y, input_width, message_input_height) == Button_State.clicked) {
                const y = point_to_screen_space(top_left_x, top_left_y).y;

                show_overlay({
                    type: Overlay_Type.teammate_menu,
                    teammate: app.current_chat,
                    at: {
                        x: game.mouse.x,
                        y: y
                    }
                })
            }
        }
    }
}

function draw_wrike(app: By_Type<App, App_Type.wrike>, width: number, height: number) {
    const bar_background = "#04454D";
    const background = "#F9F9F9";
    const block_background = "#FFFFFF";
    const inbox_text = "#4488FF";
    const inbox_warning = "#ff445a";

    const grid_color = "#EBEBEB";
    const grid_text_color = "#161616";

    const top_bar_height = 56;
    const bottom_bar_height = 24;

    const content_padding = 32;

    const inbox_width = 300;
    const inbox_height = height - top_bar_height - bottom_bar_height - content_padding - content_padding - content_padding;

    const ctx = current_context();

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    function entry_text(entry: Inbox_Entry): string {
        switch (entry.type) {
            case Inbox_Entry_Type.review_task: return "Waiting for review";
            case Inbox_Entry_Type.task_returned_to_dev: return "Defects found, returned to dev";
            case Inbox_Entry_Type.production_bug: return `Defects on prod (${entry.task.bugs}), ${entry.hours_remaining} hours left`;
        }
    }

    { // Bars, logo
        ctx.fillStyle = bar_background;
        ctx.fillRect(0, 0, width, top_bar_height);

        ctx.fillStyle = bar_background;
        ctx.fillRect(0, height - bottom_bar_height, width, bottom_bar_height);

        const logo = images.logo_wrike.img;
        ctx.drawImage(logo, width / 2 - logo.width / 2 + 0.5, top_bar_height / 2 - logo.height / 2 + 0.5);
    }

    { // Inbox
        const inbox_label_y = top_bar_height + content_padding;
        const inbox_x = content_padding;

        draw_block_title("Inbox", inbox_x, inbox_label_y);

        const inbox_y = inbox_label_y + content_padding;
        const block = draw_block(inbox_x, inbox_y, inbox_width, inbox_height);

        const entry_height = 90;

        push_clip(block, true);

        const unread_entries = game.inbox.filter(entry => !entry.read);

        if (mouse_can_interact_with_area(inbox_x, inbox_y, inbox_width, inbox_height)) {
            const max_scroll = unread_entries.length * entry_height;
            app.inbox_scroll_y = Math.max(0, Math.min(app.inbox_scroll_y + game.mouse.scroll_y, max_scroll - inbox_height));
        }

        ctx.translate(0, -app.inbox_scroll_y);

        const entry_x = inbox_x;
        let entry_y = inbox_y;
        const entry_padding = 16;

        for (const entry of unread_entries) {
            const state = button_behavior(entry_x, entry_y, inbox_width, entry_height);

            if (state == Button_State.hovered) {
                ctx.fillStyle = "#eee";
                ctx.fillRect(entry_x, entry_y, inbox_width, entry_height);
            }

            if (state == Button_State.clicked) {
                show_overlay({
                    type: Overlay_Type.inbox_entry_menu,
                    entry: entry,
                    at: point_to_screen_space(entry_x, entry_y + entry_height)
                })
            }

            push_font(15);

            const time_text = `${day_of_week_name(entry.received_at_day_of_week)}, ${hour_string(entry.received_at_hour)}`;
            const padded_x = entry_x + entry_padding;
            const time_y = entry_y + entry_padding;

            ctx.fillStyle = "#aaa";
            ctx.fillText(time_text, padded_x, time_y);

            const name_y = time_y + 24;

            ctx.fillStyle = "black";
            ctx.fillText(entry.task.name, padded_x, name_y);

            const text_y = name_y + 24;

            ctx.fillStyle = entry.type == Inbox_Entry_Type.production_bug ? inbox_warning : inbox_text;
            ctx.fillText(entry_text(entry), padded_x, text_y);

            pop_font();

            draw_line(grid_color, 1, entry_x, entry_y + entry_height, entry_x + inbox_width, entry_y + entry_height);

            entry_y += entry_height;
        }

        pop_clip();
    }

    { // Tasks
        const tasks_label_y = top_bar_height + content_padding;
        const tasks_x = content_padding + inbox_width + content_padding;
        const tasks_width = width - tasks_x - content_padding;

        draw_block_title("Tasks", tasks_x, tasks_label_y);

        const tasks_y = tasks_label_y + content_padding;

        draw_block(tasks_x, tasks_y, tasks_width, inbox_height);

        const row_height = 24;
        const status_indicator_side = 12;

        let row_y = tasks_y + row_height;

        const name_column_x = tasks_x + 24;
        const status_column_x = name_column_x + 370;
        const assignee_column_x = status_column_x + 180;
        const estimate_column_x = assignee_column_x + 120;
        const time_spent_column_x = estimate_column_x + 90;

        { // Header
            ctx.fillStyle = block_background;
            ctx.fillRect(tasks_x, tasks_y - 3, tasks_width, row_height + 3);

            push_font(12);
            ctx.fillStyle = "#777";
            ctx.fillText("Title", name_column_x, tasks_y + row_height / 2);
            ctx.fillText("Status", status_column_x, tasks_y + row_height / 2);
            ctx.fillText("Assignee", assignee_column_x, tasks_y + row_height / 2);
            ctx.fillText("Estimate", estimate_column_x, tasks_y + row_height / 2);
            ctx.fillText("Time Spent", time_spent_column_x, tasks_y + row_height / 2);
            pop_font();
        }

        const tasks_area_y = tasks_y + row_height;
        const tasks_area_height = inbox_height - row_height;

        const rect = new Path2D();
        rect.rect(tasks_x, tasks_area_y, tasks_width, tasks_area_height);
        push_clip(rect, true);

        if (mouse_can_interact_with_area(tasks_x, tasks_area_y, tasks_width, tasks_area_height)) {
            const max_scroll = all_tasks().length * row_height;
            app.task_list_scroll_y = Math.max(0, Math.min(app.task_list_scroll_y + game.mouse.scroll_y, max_scroll - tasks_area_height));
        }

        ctx.translate(0, -app.task_list_scroll_y);

        push_font(14);

        const tasks_fit_into_view = Math.ceil(tasks_area_height / row_height);
        const tasks_view_start_index = Math.floor(app.task_list_scroll_y / row_height);
        const tasks_end_index = tasks_view_start_index + tasks_fit_into_view;

        const tasks = all_tasks();

        for (let index = tasks_view_start_index; index < Math.min(tasks.length, tasks_end_index); index++) {
            const task = tasks[index];
            const row_y = tasks_y + row_height * (index + 1);
            const row_center_y = row_y + row_height / 2;

            { // Behavior
                const state = button_behavior(tasks_x, row_y, tasks_width, row_height);

                if (state == Button_State.hovered) {
                    ctx.fillStyle = "#0094FF33";
                    ctx.fillRect(tasks_x, row_y, tasks_width, row_height);
                }

                if (state == Button_State.clicked) {
                    show_overlay({
                        type: Overlay_Type.task_menu,
                        task: task,
                        at: {
                            x: game.mouse.x,
                            y: point_to_screen_space(0, row_y + row_height).y
                        }
                    });
                }
            }

            { // Name
                ctx.fillStyle = grid_text_color;
                ctx.fillText(task.full_name, name_column_x, row_center_y + 1);
            }

            { // Status
                ctx.fillStyle = status_color(task.status);
                ctx.fillRect(status_column_x - 0.5, row_center_y - status_indicator_side / 2 - 0.5, status_indicator_side, status_indicator_side);

                const status_name_x = status_column_x + status_indicator_side + 10;

                ctx.fillStyle = grid_text_color;
                ctx.fillText(status_title(task.status), status_name_x, row_center_y + 1);
            }

            { // Assignee
                const assignee = task_to_assignee(task);

                if (assignee) {
                    ctx.fillStyle = grid_text_color;
                    ctx.fillText(assignee.name, assignee_column_x, row_center_y + 1);
                }
            }

            { // Estimate
                ctx.fillStyle = grid_text_color;
                ctx.fillText(`${task.estimated_time.toString(10)}h`, estimate_column_x, row_center_y + 1);
            }

            if (task.time_spent > 0) { // Time Spent
                ctx.fillStyle = grid_text_color;
                ctx.fillText(`${task.time_spent.toString(10)}h`, time_spent_column_x, row_center_y + 1);
            }

            draw_line(grid_color, 1, tasks_x, row_y, tasks_x + tasks_width, row_y);
        }

        // Columns are always drawn on top of the grid
        ctx.translate(0, app.task_list_scroll_y);

        pop_font();
        pop_clip();

        draw_line(grid_color, 1, tasks_x, row_y, tasks_x + tasks_width, row_y);

        function draw_column_line(at_x: number) {
            draw_line(grid_color, 1, at_x, tasks_y, at_x, tasks_y + inbox_height);
        }

        draw_column_line(status_column_x - 10);
        draw_column_line(assignee_column_x - 10);
        draw_column_line(estimate_column_x - 10);
        draw_column_line(time_spent_column_x - 10);
    }

    function draw_block_title(text: string, x: number, y: number) {
        push_font(18, "bolder");

        ctx.fillStyle = "#000";
        ctx.textBaseline = "top";
        ctx.fillText(text, x, y);
        ctx.textBaseline = "middle";

        pop_font();
    }

    function draw_block(x: number, y: number, w: number, h: number): Path2D {
        const rect = path_rounded_rect(x, y, w, h, 3);
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#eee"
        ctx.shadowOffsetY = 10;
        ctx.fillStyle = block_background;
        ctx.fill(rect);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        return rect;
    }

    function task_to_assignee(task: Task): { name: string, avatar?: Image_Resource } | undefined {
        if (task.status == Task_Status.in_development) {
            if (task.assigned_to.you) {
                return { name: "Вы" };
            } else {
                return { name: task.assigned_to.teammate.name, avatar: task.assigned_to.teammate.avatar };
            }
        } else if (task.status == Task_Status.in_review) {
            if (task.assigned_to.you) {

            } else {
                return { name: "Вы" }
            }
        } else if (task.status == Task_Status.in_testing) {
            return { name: "QA Team" };
        }
    }

}

function draw_code_editor(width: number, height: number) {
    const ctx = current_context();

    const ui_background = "#3C3F41";
    const code_background = "#2B2B2B";
    const selected_tab_bg = "#4E5254";
    const tab_separator_line = "#323232";
    const tab_underline = "#4A88C7";
    const tab_name_color = "#BBBBBB";

    const keyword_color = "#CC7832";
    const string_color = "#6A8759";
    const number_color = "#6897BB";
    const code_color = "#A9B7C6";
    const comment_color = "#808080";

    const tab_height = 26;
    const tab_padding = 7;

    ctx.fillStyle = code_background;
    ctx.fillRect(0, 0, width, height);

    if (button_behavior(0, 0, width, height) == Button_State.clicked) {
        show_overlay({ type: Overlay_Type.editor_work_menu });
    }

    { // Tabs
        ctx.fillStyle = ui_background;
        ctx.fillRect(0.5, 0, width - 1.5, tab_height);

        const tab_names = [
            "UtilTokenGlobalInitializerServlet",
            "RulesNotificationNotificationTokenTokenizer",
            "ServiceTokenProxyStringTokenizer",
            "StringServiceRulesProxyUtil",
            "InitializerTokenBusinessManagementObject",
            "BusinessRulesStringInitializerRegistry"
        ];

        let tab_x = 1;

        for (let index = 0; index < tab_names.length; index++) {
            push_font(12);

            const name = tab_names[index];
            const tab_width = tab_padding + ctx.measureText(name).width + tab_padding;
            const selected = index == 0;

            ctx.lineWidth = 1;
            ctx.strokeStyle = tab_separator_line;
            ctx.fillStyle = selected ? selected_tab_bg : ui_background;
            ctx.beginPath();
            ctx.rect(tab_x, 0, tab_width, tab_height);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            ctx.fillStyle = tab_name_color;
            ctx.fillText(name, tab_x + tab_padding, tab_height / 2);

            if (selected) {
                draw_line(tab_underline, 2, tab_x, tab_height - 1, tab_x + tab_width - 1.5, tab_height - 1);
            }

            tab_x += tab_width;

            pop_font();
        }
    }

    { // Code
        ctx.textBaseline = "top";

        const line_height = 20;
        const code_top_y = tab_height + 4;

        push_font(12, "normal", true);

        for (const [index, line] of tokens.entries()) {
            let token_x = 8;

            function draw_token(token: Token, color: string, bold = false) {
                push_font(12, bold ? "bold" : "normal", true);
                const width = ctx.measureText(token.text).width;
                ctx.fillStyle = color;
                ctx.fillText(token.text, token_x, code_top_y + index * line_height);
                token_x += width;
                pop_font();
            }

            for (const token of line) {
                switch (token.kind) {
                    case Token_Kind.code: {
                        draw_token(token, code_color);
                        break;
                    }

                    case Token_Kind.keyword: {
                        draw_token(token, keyword_color, true);
                        break;
                    }

                    case Token_Kind.number: {
                        draw_token(token, number_color);
                        break;
                    }

                    case Token_Kind.string: {
                        draw_token(token, string_color);
                        break;
                    }

                    case Token_Kind.comment: {
                        draw_token(token, comment_color);
                        break;
                    }

                    default: unreachable(token.kind);
                }
            }
        }

        pop_font();

        ctx.textBaseline = "middle";
    }
}

function draw_browser(width: number, height: number) {
    const website_button_background = "#F1F3F4";

    const ctx = current_context();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);

    const logo = images.logo_iron_big.img;
    ctx.drawImage(logo, width / 2 - logo.width / 2, 100);

    const total_buttons = 2;
    const button_side = 72;
    const button_spacing = 32;

    const buttons_width = total_buttons * button_side + (total_buttons - 1) * button_spacing;

    const button_center_y = 270;
    let button_left_x = width / 2 - buttons_width / 2;

    function website_button(logo: Image_Resource, text: string, website: Website) {
        const r = button_side / 2;
        const icon_side = button_side - 28;

        path_circle(button_left_x + r, button_center_y, r);

        const state = button_behavior(button_left_x, button_center_y - r, button_side, button_side);

        if (state == Button_State.hovered) {
            ctx.shadowColor = "#ccc";
            ctx.shadowBlur = 8;
        }

        ctx.fillStyle = website_button_background;
        ctx.fill();
        ctx.shadowBlur = 0;

        const image_x = button_left_x + r - icon_side / 2;
        const image_y = button_center_y - icon_side / 2;

        ctx.drawImage(logo.img, image_x, image_y, icon_side, icon_side);

        ctx.fillStyle = "#000";
        push_font(16);

        const text_width = ctx.measureText(text).width;
        const text_x = button_left_x + r - text_width / 2;
        const text_y = button_center_y + r + 25;
        ctx.fillText(text, text_x, text_y);

        pop_font();

        button_left_x += button_side + button_spacing;

        if (state == Button_State.clicked) {
            show_overlay({
                type: Overlay_Type.website_menu,
                website: website,
                at: point_to_screen_space(button_left_x + r, button_center_y)
            })
        }
    }

    website_button(images.icon_web_jabr, "Jabr", Website.jabr);
    website_button(images.icon_web_you_cube, "YouCube", Website.you_cube);
}

function draw_window(width: number, height: number, title: string, draw_content: () => void) {
    const title_text_color = "#2E2C2E";
    const title_bar_top = "#E8E6E8";
    const title_bar_bottom = "#D2D0D2";
    const title_bar_underline = "#B0AFB0";

    const close_button_fill = "#FC625D";
    const close_button_stroke = "#EF4B47";

    const minimize_button_fill = "#35C94A";
    const minimize_button_stroke = "#26A934";

    const title_bar_height = 21;

    const start_at = layout_cursor();

    const ctx = current_context();
    const transform = ctx.getTransform();

    ctx.translate(start_at.x, start_at.y);

    { // Title bar and background
        const gradient = ctx.createLinearGradient(0, 0, 0, title_bar_height);
        gradient.addColorStop(0, title_bar_top);
        gradient.addColorStop(1, title_bar_bottom);

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#333";
        const rect = path_rounded_rect(0, 0, width, height + title_bar_height, 4);
        ctx.fill(rect);
        ctx.shadowBlur = 0;

        push_clip(rect);
    }

    { // Underline
        draw_line(title_bar_underline, 1,
            0, title_bar_height,
            width, title_bar_height
        );
    }

    { // Title text
        const title_font = 12;
        push_font(title_font);

        const title_text_width = ctx.measureText(title).width;
        ctx.fillStyle = title_text_color;
        ctx.fillText(title, width / 2 - title_text_width / 2, title_bar_height / 2);

        pop_font();
    }

    let button_index = 0;

    function title_bar_button(fill: string, stroke: string) {
        const button_r = 6;
        const x_offset = 8 + (8 + button_r * 2) * button_index;
        const y_offset = 5;

        const result = button_behavior(x_offset, y_offset, button_r * 2, button_r * 2);

        ctx.fillStyle = result == Button_State.hovered ? increase_brightness(fill, 20) : fill;
        ctx.strokeStyle = result == Button_State.hovered ? increase_brightness(stroke, 20) : stroke;
        ctx.lineWidth = 1;

        path_circle(x_offset + button_r, y_offset + button_r, button_r);

        ctx.fill()
        ctx.stroke();

        button_index++;

        if (result == Button_State.clicked) {
            close_current_app();
        }
    }

    title_bar_button(close_button_fill, close_button_stroke);
    title_bar_button(minimize_button_fill, minimize_button_stroke);

    ctx.translate(0, title_bar_height + 1);
    draw_content();

    pop_clip();
    ctx.setTransform(transform);
}

function draw_top_bar(width: number) {
    const ctx = current_context();
    const color_bg = "rgba(210,210,210,0.4)";
    const height = 22;

    ctx.shadowBlur = 16;
    ctx.shadowColor = "black";
    ctx.fillStyle = color_bg;
    ctx.fillRect(0, 0, width, height);
    ctx.shadowBlur = 0;

    const padding_side = 20;

    { // Main computer menu
        const logo_side = 16;
        const pear_x = padding_side;
        const pear_y = height / 2 - logo_side / 2;

        ctx.drawImage(images.logo_pear.img, padding_side, pear_y, logo_side, logo_side);

        const name_x = pear_x + logo_side + 6;
        const name_y = height / 2 + 1;

        const name = "PearNote";

        push_font(14, "bold");

        const name_width = ctx.measureText(name).width;

        ctx.fillStyle = "black";
        ctx.fillText(name, name_x, name_y);
        pop_font();

        const total_width = name_x + name_width - pear_x + 4;
        const button = button_behavior(pear_x, 0, total_width, height);

        if (button == Button_State.clicked) {
            show_overlay({
                type: Overlay_Type.computer_menu,
                at: {
                    x: pear_x,
                    y: height
                }
            });
        } else if (button == Button_State.hovered) {
            ctx.fillStyle = "rgba(99,161,255,0.4)";
            ctx.fillRect(pear_x, 0, total_width, height);
        }

        // Day end tip
        if (game.day == 0 && game.hour_of_day >= work_end_hour && game.overlay.type != Overlay_Type.computer_menu) {
            ctx.fillStyle = "#fff";

            const tip_text = "Завершить работу на сегодня можно здесь";

            const tip_x = (Math.sin(game.time / 250) + 1) * 15 + name_x + name_width + 32;
            const tip_y = 4;

            push_font(15);

            const tip_text_width = ctx.measureText(tip_text).width;
            const tip_width = 16 + tip_text_width + 16;
            const tip_height = 28;

            const rect = path_rounded_rect(tip_x, tip_y, tip_width, tip_height,  4);

            ctx.shadowBlur = 8;
            ctx.shadowColor = "black";
            ctx.fill(rect);
            ctx.shadowBlur = 0;

            ctx.fillStyle = "black";
            ctx.fillText(tip_text, tip_x + 16, tip_y + tip_height / 2);

            pop_font();

            ctx.beginPath();
            ctx.moveTo(tip_x - 5, tip_y);
            ctx.lineTo(tip_x - 5, tip_y + tip_height);
            ctx.lineTo(tip_x - tip_height * 0.75, tip_y + tip_height / 2);
            ctx.closePath();
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#777";

            ctx.fill();
            ctx.stroke();
        }
    }

    { // Date and time
        const time_text = hour_string(game.hour_of_day);

        push_font(14, "bolder");
        const time_width = ctx.measureText(time_text).width;
        ctx.fillStyle = "black";
        ctx.fillText(time_text, width - padding_side - time_width, height / 2);
        pop_font();

        const day_text = `Сентябрь ${game.day + 1}, ${day_of_week_name(game.day_of_week)}`;

        push_font(14);
        const day_width = ctx.measureText(day_text).width;
        ctx.fillStyle = "black";
        ctx.fillText(day_text, width - padding_side - time_width - day_width - 6, height / 2);

        pop_font();
    }
}

function draw_dock(width: number, height: number) {
    const color_top = "rgba(210,210,210,0.4)";
    const color_bottom = "rgba(191,191,191,0.4)";
    const notifications_color = "#F44542";

    const start_at = layout_cursor();
    const ctx = current_context();

    ctx.translate(start_at.x, start_at.y);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color_top);
    gradient.addColorStop(1, color_bottom);

    ctx.shadowBlur = 16;
    ctx.shadowColor = "black";
    ctx.fillStyle = gradient;
    const rect = path_rounded_rect(0, 0, width, height, 8);
    ctx.fill(rect);
    ctx.shadowBlur = 0;

    let app_index = 0;

    function ease_out_circular(x: number): number {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }

    const hover_animation_time_ms = 60;

    for (const app of game.apps) {
        const image = app_icon(app.type).img;
        const adjust = ease_out_circular(app.dock_hover_time / hover_animation_time_ms) * 15;
        const notifications = get_app_notifications(app);

        const x = 16 + app_index * (64 + 16) - adjust / 2;
        const y = 16 - adjust / 2;
        const w = 64 + adjust, h = 64 + adjust;

        ctx.drawImage(image, 0, 0, image.width, image.height, x, y, w, h);

        if (notifications > 0) {
            const r = 12;

            const bubble_x = x + w;
            const bubble_y = 16 - adjust / 2;

            ctx.shadowColor = "#333";
            ctx.shadowBlur = 4;

            fill_circle(notifications_color, bubble_x, bubble_y, r);

            ctx.shadowBlur = 0;

            const bubble_text = notifications.toString(10);

            push_font(16);

            const text_width = ctx.measureText(bubble_text).width;

            ctx.fillStyle = "#fff";
            ctx.fillText(bubble_text, bubble_x - text_width / 2, bubble_y);
            pop_font();
        }

        const result = button_behavior(x, y, w, h);

        if (result == Button_State.hovered) {
            app.dock_hover_time = Math.min(app.dock_hover_time + game.frame_time, hover_animation_time_ms);
        } else if (result == Button_State.clicked) {
            close_current_app();
            game.current_app = app;
        } else {
            app.dock_hover_time = Math.max(0, app.dock_hover_time - game.frame_time);
        }

        app_index++;
    }

    ctx.translate(-start_at.x, -start_at.y);

    push_size(height);
}

function hour_string(hour: number) {
    return `${hour.toString(10).padStart(2, "0")}:00`
}

function draw_calendar(width: number) {
    function calendar_event_name(event: Calendar_Event): string {
        switch (event.type) {
            case Calendar_Event_Type.one_on_one: return `One on One - ${event.teammate.name}`;
            case Calendar_Event_Type.lead_meeting: return "Team Lead Sync";
            case Calendar_Event_Type.candidate_interview: return `Interview - ${event.candidate_name}`;
            case Calendar_Event_Type.daily_standup: return "Daily Standup";
            case Calendar_Event_Type.knowledge_sharing: return "Knowledge Sharing";
            case Calendar_Event_Type.lunch: return "Lunch";
        }
    }

    const text_color = "#70757A";
    const grid_color = "#DADCE0";
    const today_color = "#1A73E8";
    const now_color = "#EA4335";
    const event_color = "#039BE5";
    const past_event_color = "#B3E1F7";
    const past_event_text_color = "#69818D";

    const ctx = current_context();

    const cell_height = 48;
    const total_hours = work_end_hour - work_start_hour;

    const grid_starts_at = 90;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, (total_hours + 1) * cell_height);

    draw_line(grid_color, 1,
        grid_starts_at, 0,
        grid_starts_at, (total_hours + 1) * cell_height
    );

    function hour_grid_y(hour: number) {
        return (-(work_start_hour - hour) + 0.5) * cell_height;
    }

    for (let hour = work_start_hour; hour <= work_end_hour; hour++) {
        const y = hour_grid_y(hour);
        push_font(10);
        ctx.fillStyle = text_color;
        ctx.fillText(`${hour_string(hour)}`, 50, y);
        pop_font();

        draw_line(grid_color, 1,
            grid_starts_at - 10, y,
            width, y
        );

        for (const event of game.today_events) {
            if (event.start_hour == hour) {
                const past_event = is_past_event(event);

                ctx.fillStyle = past_event ? past_event_color : event_color;

                const event_width = width - grid_starts_at;
                const event_height = (event.duration * cell_height) - 4;

                const rect = path_rounded_rect(grid_starts_at, y, event_width, event_height, 4);
                ctx.fill(rect);

                const event_x = grid_starts_at;
                const event_y = y;

                const state = button_behavior(
                    event_x,
                    event_y,
                    event_width,
                    event_height
                );

                if (state == Button_State.clicked) {
                    const screen_space = point_to_screen_space(
                        event_x + event_width / 2,
                        event_y + event_height
                    );

                    show_overlay({
                        type: Overlay_Type.calendar_event_menu,
                        event: event,
                        at: {
                            x: screen_space.x,
                            y: screen_space.y
                        }
                    });
                }

                const old_baseline = ctx.textBaseline;

                ctx.fillStyle = past_event ? past_event_text_color : "#fff";
                ctx.textBaseline = "top";

                const pad_x = 8;
                const pad_y = 6;

                push_font(12, "bold");
                ctx.fillText(calendar_event_name(event), grid_starts_at + pad_x, y + pad_y);
                pop_font();

                push_font(12, "normal");
                ctx.fillText(`${hour_string(hour)} - ${hour_string(hour + event.duration)}`, grid_starts_at + pad_x, y + pad_y + 16);
                pop_font();

                ctx.textBaseline = old_baseline;
            }
        }
    }

    const r = 6;
    const y = hour_grid_y(game.hour_of_day);

    fill_circle(now_color, grid_starts_at, y, r);
    draw_line(now_color, 2,
        grid_starts_at, y,
        width, y
    );
}

function open_app(type: App_Type) {
    game.current_app = game.apps.find(app => app.type == type);
}

function close_current_app() {
    if (game.current_app && game.current_app.type == App_Type.limp) {
        mark_current_chat_as_read(game.current_app);
    }

    delete game.current_app;
}

function draw_overlay_screen() {
    const overlay = game.overlay;

    type Menu_Button = {
        text: string
        hovered: boolean
    }

    function draw_menu_background(x: number, y: number, width: number, height: number): Path2D {
        const overlay_show_time = game.overlay.type == Overlay_Type.game_over ? 2000 : 100;

        const rect = path_rounded_rect(x, y, width, height, 4);
        const opacity = (game.time - game.overlay_shown_at) / overlay_show_time;

        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(119, 119, 119, ${opacity})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill(rect);
        ctx.shadowBlur = 0;

        return rect;
    }

    function auto_menu(x: number, y: number, width: number) {
        const buttons: Menu_Button[] = [];
        const button_height = 40;
        const after_message_spacing = 8;

        let message_font = 16;
        let padding = 16;
        let message_bottom_y = y;
        let lines: string[] = [];
        let line_height = 0;
        let center_text = false;

        return {
            message_font(value: number): void {
                message_font = value;
            },
            center_text(): void {
                center_text = true;
            },
            padding(value: number): void {
                padding = value;
            },
            message(text: string): void {
                line_height = message_font + 4;
                push_font(message_font);
                lines = text_to_lines(text, width - padding * 2);
                message_bottom_y = y + padding + lines.length * line_height;
                pop_font();
            },
            button(text: string): boolean {
                if (buttons.length == 0 && lines.length > 0) {
                    message_bottom_y += after_message_spacing;
                }

                const button_y = message_bottom_y + buttons.length * button_height;
                const state = button_behavior(x, button_y, width, button_height);

                buttons.push({
                    text: text,
                    hovered: state == Button_State.hovered
                });

                return state == Button_State.clicked;
            },
            finish() {
                const height = (message_bottom_y - y) + buttons.length * button_height + ((buttons.length == 0) ? padding : 0);

                const rect = draw_menu_background(x, y, width, height);
                push_clip(rect);

                let line_y = y + padding;

                push_font(message_font);
                ctx.textBaseline = "top";

                for (const line of lines) {
                    const text_x = center_text
                        ? x + (width / 2 - ctx.measureText(line).width / 2)
                        : x + padding;

                    ctx.fillStyle = "#000";
                    ctx.fillText(line, text_x, line_y);

                    line_y += line_height;
                }

                ctx.textBaseline = "middle";
                pop_font();

                let button_y = message_bottom_y;

                push_font(16);

                for (const button of buttons) {
                    if (button.hovered) {
                        ctx.fillStyle = "#ccc";
                        ctx.fillRect(x, button_y, width, button_height);
                    }

                    ctx.fillStyle = lines.length > 0 ? "#003a57" : "#000";
                    ctx.fillText(button.text, x + padding, button_y + button_height / 2, width);

                    button_y += button_height;
                }

                pop_font();
                pop_clip();
            }
        }
    }

    function message_overlay(text: string) {
        message_overlay_and_then({ type: Overlay_Type.none }, text);
    }

    function message_overlay_and_then(overlay: Overlay, text: string) {
        show_overlay({ type: Overlay_Type.message, text: text, next_overlay: overlay });
    }

    function exit_overlay() {
        show_overlay({ type: Overlay_Type.none });
    }

    function allow_exit() {
        if (button_behavior(0, 0, game.canvas_width, game.canvas_height) == Button_State.clicked) {
            exit_overlay();
        }
    }

    function block_exit() {
        button_behavior(0, 0, game.canvas_width, game.canvas_height);
    }

    function big_centered_menu(height_offset = 500, width = 600) {
        const menu = auto_menu(game.canvas_width / 2 - width / 2, game.canvas_height - height_offset, width);
        menu.padding(16);
        menu.message_font(20);

        return menu;
    }

    function deadline_stats_message(show_total_tasks: boolean) {
        function days(x: number) {
            return pluralize_ru(x, "день", "дня", "дней");
        }

        function remaining(x: number) {
            return pluralize_ru(x, "Осталась", "Остались", "Осталось");
        }

        function tasks(x: number) {
            return pluralize_ru(x, "задача", "задачи", "задач");
        }

        const days_until = game.deadline_day - game.day;
        const not_done = tasks_not_done();
        const total = game.backlog.length;

        if (show_total_tasks) {
            return `До дедлайна ${days_until} ${days(days_until)}\n${remaining(not_done)} ${not_done} ${tasks(not_done)} (из ${total})`;
        } else {
            return `До дедлайна ${days_until} ${days(days_until)}\nВ беклоге ${not_done} ${tasks(not_done)}`;
        }
    }

    function new_day_message() {
        message_overlay(`${day_of_week_starts(game.day_of_week)}\n${deadline_stats_message(true)}`);
    }

    const ctx = current_context();

    switch (overlay.type) {
        case Overlay_Type.none: {
            break;
        }

        case Overlay_Type.message: {
            const menu = big_centered_menu();
            menu.center_text();
            menu.padding(32);
            menu.message(overlay.text);
            menu.finish();

            if (button_behavior(0, 0, game.canvas_width, game.canvas_height) == Button_State.clicked) {
                show_overlay(overlay.next_overlay);
            }

            break;
        }

        case Overlay_Type.lang: {
            const menu = big_centered_menu();
            menu.center_text();
            menu.message("Language");

            for (const [name, language] of [["English", en], ["Russian", ru]]) {
                if (menu.button(name)) {
                    i18n = language;
                    show_overlay({ type: Overlay_Type.intro });
                }
            }

            menu.finish();

            block_exit();


            break;
        }

        case Overlay_Type.intro: {
            const menu = big_centered_menu();
            menu.center_text();

            const team = game.team.map(teammate => `${teammate.name} - специалист в ${teammate.skills.map(skill_name).join(", ")}`).join("\n");

            menu.message(i18n.overlay.intro.header({ team }))

            for (const difficulty of [
                [Difficulty.junior, 0.3] as const,
                [Difficulty.middle, 0.5] as const,
                [Difficulty.senior, 0.7] as const,
                [Difficulty.teamlead, 0.9] as const
            ]) {
                const [kind, multiplier] = difficulty;

                if (menu.button(i18n.overlay.intro.difficulty({ difficulty: difficulty_name(difficulty[0]) }))) {
                    game.backlog = generate_backlog(game.team.length + 1, game.deadline_day, multiplier * 0.5);
                    game.difficulty = kind;

                    for (const teammate of game.team) {
                        teammate.skill_level = Math.max(0.1, teammate.skill_level - multiplier * 0.35);
                    }

                    message_overlay(deadline_stats_message(false));
                }
            }

            menu.finish();

            block_exit();

            break;
        }

        case Overlay_Type.weekend: {
            const menu = big_centered_menu();
            menu.center_text();

            menu.message(`${day_of_week_starts(game.day_of_week)}. Сегодня у Вас заслуженный выходной. Вы можете продолжить работать, но достоверно известно, что в выходные нужно отдыхать.`);

            if (menu.button("Отдыхать до понедельника")) {
                do {
                    skip_hours(1);
                    increase_health(4);
                } while (!(game.day_of_week == 1 && game.hour_of_day == 10));

                new_day_message();
            }

            if (menu.button("Заняться чем-то еще")) {
                exit_overlay();
            }

            menu.finish();

            block_exit();

            break;
        }

        case Overlay_Type.calendar_event_menu: {
            const top_center = overlay.at;
            const menu_width = 300;
            const menu = auto_menu(top_center.x - menu_width / 2, top_center.y, menu_width);

            if (overlay.event.start_hour == game.hour_of_day) {
                if (overlay.event.type == Calendar_Event_Type.lunch) {
                    if (menu.button("Идти на обед (1 ч.)")) {
                        const food = [
                            "макарошки с курицей",
                            "пюрешку с гуляшем",
                            "супчик",
                            "котлетки",
                            "салатик",
                            "рыбку",
                            "кусочек пиццы"
                        ];

                        const random_food = food[Math.floor(Math.random() * food.length)];

                        game.player.attended_meetings_today.push(overlay.event.type);

                        skip_hours(1);
                        increase_health(10);

                        message_overlay(`Сегодня в местной столовой как всегда людно. Отстояв в очереди, Вы купили ${random_food} и с удовольствием пообедали. [+Здоровье]`);
                    }
                }

                if (overlay.event.type == Calendar_Event_Type.daily_standup) {
                    menu.message("На ежедневном стендапе все члены команды делятся краткой информацией о проделанной за предыдущий день работе и текущих блокерах");

                    if (menu.button("Подключиться к стендапу (1 ч.)")) {
                        game.player.attended_meetings_today.push(overlay.event.type);
                        close_current_app();
                        show_overlay({
                            type: Overlay_Type.standup_report,
                            queue: [...game.team],
                            random_verb_divisible: Math.round(Math.random() * 65536)
                        });
                    }
                }

                if (overlay.event.type == Calendar_Event_Type.one_on_one) {
                    menu.message("На еженедельных One on One встречах члены команды встречаются с их прямым менеджером и обсуждают рабочие и личные вопросы в свободной форме. Это помогает увеличить доверие между членами команды и выявить потенциальные проблемы заранее");

                    if (menu.button("Подключиться к встрече (1 ч.)")) {
                        game.player.attended_meetings_today.push(overlay.event.type);
                        overlay.event.teammate.skill_level += 0.05;
                        skip_hours(1);
                        message_overlay(`One on One прошел продуктивно. ${overlay.event.teammate.name} поделился своими переживаниями по поводу дедлайна и успехами в работе. Вы поделились кусочком тимлидской мудрости и ${overlay.event.teammate.name} явно остался доволен [+Навык]`);
                    }
                }

                if (overlay.event.type == Calendar_Event_Type.knowledge_sharing) {
                    menu.message(`Knowledge Sharing - еженедельное событие на котором один из разработчиков освещает потенциально полезную коллегам тему. Тема сегодняшней встречи - ${overlay.event.topic}`);

                    if (menu.button("Присоединиться и послушать (1 ч.)")) {
                        game.player.attended_meetings_today.push(overlay.event.type);
                        game.player.productivity += 20;
                        skip_hours(1);
                        message_overlay(`Шейринг сегодня был максимально интересный. Вы буквально прозрели на тему ${overlay.event.topic} и чувствуете, будто теперь можете вообще всё [+Производительность]`);
                    }
                }

                if (overlay.event.type == Calendar_Event_Type.candidate_interview) {
                    menu.message(`Одна из Ваших обязанностей - участвовать в собеседованиях потенциальных кандидатов, в том числе в другие команды.`);

                    if (menu.button("Подключиться к звонку (2 ч.)")) {
                        game.player.attended_meetings_today.push(overlay.event.type);
                        skip_hours(2);
                        message_overlay(`Собеседование как всегда было довольно выматывающим. Но сегодняшний кандидат, ${overlay.event.candidate_name}, был довольно интересным.`);
                    }
                }

                if (overlay.event.type == Calendar_Event_Type.lead_meeting) {
                    menu.message(`Еженедельный синк тимлидов служит чем-то вроде форума для быстрой коммуникации среди команд. На нем всегда можно узнать свежие новости о работе других коллег или задать вопрос о пересекающейся функциональности`);

                    if (menu.button("Подключиться к встрече (1 ч.)")) {
                        game.player.attended_meetings_today.push(overlay.event.type);
                        skip_hours(1);
                        message_overlay(`На сегодняшнем синке не было ничего особо интересного`);
                    }
                }

                if (menu.button("Подумать еще")) {
                    exit_overlay();
                }
            } else {
                if (overlay.event.start_hour < game.hour_of_day) {
                    if (game.hour_of_day < overlay.event.start_hour + overlay.event.duration) {
                        menu.message("Эта встреча уже началась, Вы опоздали!");
                    } else {
                        menu.message("Это событие уже закончилось");
                    }
                } else {
                    menu.message("Это событие еще не началось, к нему можно будет присоединиться позже!")
                }
            }

            menu.finish();

            allow_exit();

            break;
        }

        case Overlay_Type.website_menu: {
            const center = overlay.at;
            const menu_width = 300;
            const menu = auto_menu(center.x - menu_width / 2, center.y + 32, menu_width);

            if (overlay.website == Website.jabr) {
                menu.message("Жабр - один из самых известных ресурсов с постоянно пополняющимся архивом технических статей")

                if (menu.button("Читать Жабр (1 ч.)")) {
                    skip_hours(1);
                    message_overlay(`Пролистав пару технических статей и с десяток холиваров в комментариях, Вы буквально чувствуете, как растет Ваш мозг [+Производительность]`);
                    game.player.productivity += 5;
                }
            } else if (overlay.website == Website.you_cube) {
                menu.message("Интересно что нового на Вашем любимом сайте с видосиками?")

                if (menu.button("Смотреть Юкуб (1 ч.)")) {
                    const channels = [
                        "смешные моменты из Офиса",
                        "пару видосов Лапенко",
                        "интервью Дудя",
                        "обзор Вилсакома",
                        "летсплей Куплинова",
                        "серию Зашкварных Историй",
                        "видосик Сыендука",
                        "эпизод TiX",
                        "видео об очередном изобретении KREOSAN'а"
                    ];

                    skip_hours(1);
                    message_overlay(`Посмотрев ${random_in_array(channels)}, Вы чувствуете себя совершенно свободным от мирских забот [-Выгорание]`);
                    game.player.burnout = Math.max(0, game.player.burnout - 5);
                }
            } else {
                unreachable(overlay.website);
            }

            menu.finish();

            allow_exit();
            break;
        }

        case Overlay_Type.computer_menu: {
            const top_left = overlay.at;
            const menu_width = 300;
            const menu = auto_menu(top_left.x, top_left.y, menu_width);

            if (menu.button("Завершить работу (на сегодня)")) {
                do {
                    skip_hours(1);
                    increase_health(4);
                } while (game.hour_of_day != 10)

                close_current_app();
                exit_overlay();

                if (game.day_of_week > work_days) {
                    show_overlay({
                        type: Overlay_Type.weekend
                    })
                } else {
                    new_day_message();
                }
            }

            menu.finish();

            allow_exit();

            break;
        }

        case Overlay_Type.inbox_entry_menu: {
            const top_left = overlay.at;
            const menu_width = 300;
            const menu = auto_menu(top_left.x, top_left.y, menu_width);

            const entry = overlay.entry;

            if (entry.type == Inbox_Entry_Type.review_task && entry.task.status == Task_Status.in_review) {
                menu.message("После выполнения задачи разработчиком необходимо провести ревью кода. Обычно эта задача ложится на тимлида (т.е. Вас)");

                if (menu.button("Сделать ревью")) {
                    show_overlay({
                        type: Overlay_Type.code_review,
                        task: entry.task
                    });

                    close_current_app();
                }
            }

            if (entry.type == Inbox_Entry_Type.task_returned_to_dev) {
                menu.message("Судя по всему, команда QA обнаружила в этой задаче серьезные баги и вернула ее обратно разработчику");

                if (menu.button("Пометить прочитанным")) {
                    entry.read = true;
                    exit_overlay();
                }
            }

            if (entry.type == Inbox_Entry_Type.production_bug) {
                menu.message(`Тикет от саппорта. Судя по всему в одной из наших задач, которая уже уехала на прод, обнаружились серьезные баги. Их нужно исправить за отведенное время (по нашей договоренности с клиентами). Багов осталось: ${entry.task.bugs}`);

                if (menu.button("Работать над багами (1 ч.)")) {
                    increase_burnout_if_working_past_work_time();
                    skip_hours(1);
                    entry.task.bugs--;

                    if (entry.task.bugs == 0) {
                        message_overlay(`Похоже, что все проблемы в тикете были исправлены, клиенты подтвердили отсутствие дефектов, можно расслабиться`);
                        entry.read = true;
                    }
                }
            }

            if (menu.button("Подумать еще")) {
                exit_overlay();
            }

            menu.finish();

            allow_exit();

            break;
        }

        case Overlay_Type.task_menu: {
            const top_left = overlay.at;
            const menu_width = 300;
            const menu = auto_menu(top_left.x, top_left.y, menu_width);
            const task = overlay.task;
            menu.message_font(17);
            menu.padding(16);

            function task_text(): string {
                switch (task.status) {
                    case Task_Status.new: {
                        return "Над этой задачей еще никто не начинал работу";
                    }

                    case Task_Status.in_development: {
                        if (task.assigned_to.you) {
                            return "Сейчас назначена на Вас!";
                        } else {
                            return `Над этой задачей сейчас работает ${task.assigned_to.teammate.name}`;
                        }
                    }

                    case Task_Status.in_review: {
                        if (task.assigned_to.you) {
                            return "Вы передали эту задачу в ревью другим тимлидам. Обычно это занимает порядка одного рабочего дня.";
                        } else {
                            return `Задача ${task.assigned_to.teammate.name_genitive} готова и ждет от Вас ревью`;
                        }
                    }

                    case Task_Status.in_testing: {
                        return "Эта задача была передана в тестирование. Если все идет нормально, этот процесс занимает порядка одного рабочего дня, но при обнаружении серьезных дефектов, задача всегда может быть возвращена разработчику."
                    }

                    case Task_Status.done: {
                        return "Эта задача уже на проде. Мы такие молодцы!"
                    }

                }
            }

            menu.message(`"${overlay.task.name}". ${task_text()}`);

            if (task.status == Task_Status.in_development && task.assigned_to.you) {
                if (menu.button("Перейти в редактор CodeJunkie")) {
                    open_app(App_Type.code_junkie);
                    exit_overlay();
                }
            }

            if (task.status == Task_Status.in_review && !task.assigned_to.you) {
                if (menu.button("Сделать ревью")) {
                    show_overlay({
                        type: Overlay_Type.code_review,
                        task: task
                    });

                    close_current_app();
                }
            }

            if (task.status == Task_Status.new && !find_your_first_current_task_in_dev()) {
                if (menu.button("Взять в разработку")) {
                    assign_task(task, { you: true });
                }
            }

            menu.finish();

            allow_exit();

            break;
        }

        case Overlay_Type.teammate_menu: {
            const teammate = overlay.teammate;
            const task = find_first_assigned_task_in_dev(teammate);
            const top_left = overlay.at;
            const menu_width = 300;
            const menu = auto_menu(top_left.x, top_left.y, menu_width);

            if (is_work_time()) {
                if (task && task.developer_stuck_hours > 0) {
                    if (menu.button(`Помочь ${teammate.name_dative} с задачей (1 ч.)`)) {
                        task.developer_stuck_hours = 0;
                        teammate.skill_level += 0.05;

                        receive_message_from(teammate, `Спасибо${random_in_array(["", "!", "!!"])}`, true);
                        skip_hours(1);
                        message_overlay(`Свежим взглядом пробежавшись по задаче ${teammate.name_genitive}, Вы довольно быстро обнаружили проблему и мудрым советом помогли ему продолжить работу [+Навык]`)
                    }
                } else {
                    menu.message(`Не приходит в голову, о чем сейчас можно было бы поговорить`)
                }
            } else {
                menu.message(`Время уже не рабочее и ${teammate.name} ушел в оффлайн, лучше написать ему позже`)
            }

            menu.finish();

            allow_exit();

            break;
        }

        case Overlay_Type.standup_report: {
            const queue = overlay.queue;
            const teammate = queue[0];

            const avatar_side = 256;

            function draw_standup_avatar(img: Image_Resource, name: string, title: string) {
                const x = game.canvas_width / 2 - avatar_side / 2
                const y = game.canvas_height - 840;

                const ctx = current_context();
                const rect = path_rounded_rect(x, y, avatar_side, avatar_side + 60, 4);

                ctx.shadowBlur = 8;
                ctx.shadowColor = `rgba(119, 119, 119, 1)`;
                ctx.fillStyle = "#fff";
                ctx.fill(rect);
                ctx.shadowBlur = 0;

                push_clip(rect);

                ctx.drawImage(img.img, x, y, avatar_side, avatar_side);

                push_font(18);

                const name_width = ctx.measureText(name).width;
                const name_x = x + avatar_side / 2 - name_width / 2;
                const name_y = y + avatar_side + 16;

                ctx.fillStyle = "#000";
                ctx.fillText(name, name_x, name_y);

                pop_font();

                push_font(15);

                const title_width = ctx.measureText(title).width;
                const title_x = x + avatar_side / 2 - title_width / 2;
                const title_y = name_y + 24;

                ctx.fillStyle = "#777";
                ctx.fillText(title, title_x, title_y);

                pop_font();

                pop_clip();
            }

            const menu = big_centered_menu(500, 750);

            if (teammate) {
                const current_task = find_first_assigned_task_in_dev(teammate);

                draw_standup_avatar(teammate.avatar, teammate.name, teammate.skill_title);

                function continue_to_next_teammate() {
                    const updated_queue = queue.slice(1);

                    show_overlay({
                        type: Overlay_Type.standup_report,
                        queue: updated_queue,
                        random_verb_divisible: Math.round(Math.random() * 65536)
                    });
                }

                const random_verb_divisible = overlay.random_verb_divisible;

                function teammate_message() {
                    if (current_task) {
                        const actions = [
                            "Работал над",
                            "Старался над",
                            "Залипал в",
                            "Трудился над",
                            "Тупил над",
                            "Врубался в",
                            "Втыкал в"
                        ];

                        // Biased, but who cares
                        const action = actions[random_verb_divisible % actions.length];

                        if (current_task.developer_stuck_hours > 0) {
                            return `${action} ${current_task.name}, немного застрял, пытаюсь разобраться`;
                        } else {
                            if (current_task.remaining_work_hours < 3) {
                                return `${action} ${current_task.name}, надеюсь, сегодня закончу`;
                            } else {
                                return `${action} ${current_task.name}`;
                            }
                        }
                    } else {
                        const strings = [
                            "Закончил все свои задачи, жду следующей",
                            "Задачки кончились, что взять следующим?",
                            "Предыдущие задачки уехали, готов взять еще",
                            "Прошлая задачка готова, какую брать дальше?",
                            "Доделал всё, над чем работал, буду брать новую задачку"
                        ];

                        // Biased, but who cares
                        return strings[random_verb_divisible % strings.length];
                    }
                }

                menu.message(teammate_message());

                if (current_task) {
                    if (menu.button(`Продолжить`)) {
                        continue_to_next_teammate();
                    }
                } else {
                    const tasks = free_tasks().slice(0, 5);
                    for (const task of tasks) {
                        if (menu.button(`Предложить взять ${task.full_name}, оценка: ${task.estimated_time}`)) {
                            assign_task(task, {
                                you: false,
                                teammate: teammate
                            });

                            continue_to_next_teammate();
                        }
                    }

                    if (tasks.length == 0) {
                        if (menu.button("Нет свободных задач, продолжить")) {
                            continue_to_next_teammate();
                        }
                    }
                }
            } else {
                const current_task = find_your_first_current_task_in_dev();

                draw_standup_avatar(images.default_avatar, "Вы", "TeamLead");

                function your_message() {
                    if (current_task) {
                        return `Пока что работаю над ${current_task.name}`;
                    } else {
                        return "Беру следующую задачу в работу";
                    }
                }

                function finish_standup() {
                    skip_hours(1);
                    message_overlay(`Стендап закончен, рабочий день начался!`);
                }

                menu.message(your_message());

                if (current_task) {
                    if (menu.button("Продолжить")) {
                        finish_standup();
                    }
                } else {
                    const tasks = free_tasks().slice(0, 5);

                    for (const task of tasks) {
                        if (menu.button(`Взять на себя ${task.full_name}, оценка: ${task.estimated_time}`)) {
                            assign_task(task, { you: true });

                            finish_standup();
                        }
                    }

                    if (tasks.length == 0) {
                        if (menu.button("Нет свободных задач, продолжить")) {
                            finish_standup();
                        }
                    }
                }
            }

            menu.finish();

            block_exit();

            break;
        }

        case Overlay_Type.editor_work_menu: {
            const menu = big_centered_menu();

            const my_task = find_your_first_current_task_in_dev();

            if (my_task) {
                const work_remaining_message = (): string => {
                    const hours = my_task.remaining_work_hours;

                    if (hours == my_task.estimated_time) {
                        return `В этой задаче совсем ничего не сделано. Время поработать?`
                    }

                    // TODO more of those
                    if (hours > 5) {
                        return `В текущей задаче еще полно работы`;
                    } else if (hours > 2) {
                        return `Кажется, в этой задаче большая часть работы готова`;
                    } else if (hours == 0) {
                        return `Основной код задачи готов!`;
                    } else {
                        return `В задачке осталось совсем немного работы`;
                    }
                }

                menu.message(work_remaining_message());

                if (my_task.remaining_work_hours > 0) {
                    if (menu.button(`Работать над текущей задачей (1 ч.)`)) {
                        increase_burnout_if_working_past_work_time();
                        skip_hours(1);

                        const work_effort = (game.player.productivity / 100);

                        my_task.remaining_work_hours = Math.max(0, my_task.remaining_work_hours - work_effort);
                        my_task.time_spent++;
                        my_task.bugs += Math.floor(Math.random() * 2.5);

                        if (my_task.remaining_work_hours > 5) {
                            message_overlay_and_then(overlay, `Хрустнув пальцами, Вы приступили к работе. Спустя час непрерывного стука по клавиатуре Вы наконец дошли до состояния, когда можно сделать коммит`)
                        } else if (my_task.remaining_work_hours > 2) {
                            message_overlay_and_then(overlay, `Потянувшись в кресле, Вы приступили к работе. Спустя час злостного рефакторинга Вы наконец дошли до состояния, когда можно сделать коммит`)
                        } else if (my_task.remaining_work_hours == 0) {
                            message_overlay_and_then(overlay, `Сделав глоток кофе, Вы приступили к работе. Спустя час распиливания сервисов Вы наконец дошли до состояния, когда можно сделать коммит`);
                        } else {
                            message_overlay_and_then(overlay, `Глубоко вдохнув, Вы приступили к работе. Спустя час переписывания чужого кода Вы наконец дошли до состояния, когда можно сделать коммит`)
                        }
                    }
                } else {
                    if (menu.button(`Передать задачу в ревью`)) {
                        message_overlay(`С чувством выполненного долга, Вы передали задачу в ревью`);
                        pass_task_to_review(my_task);
                    }

                    if (!my_task.tests_written && menu.button(`Написать тесты (1 ч.)`)) {
                        const found_bugs = Math.round((0.5 + Math.random() * 0.5) * my_task.bugs);

                        my_task.time_spent++;
                        my_task.tests_written = true;
                        my_task.bugs -= found_bugs;

                        increase_burnout_if_working_past_work_time();
                        message_overlay_and_then(overlay, `Поймав по пути пару багов, Вы покрыли большую часть кода тестами. На душе стало чуть-чуть спокойнее`);
                        skip_hours(1);
                    }

                    if (!my_task.instructions_for_qa_written && menu.button(`Написать подробные инструкции для QA (1 ч.)`)) {
                        my_task.instructions_for_qa_written = true;
                        my_task.time_spent++;
                        increase_burnout_if_working_past_work_time();
                        message_overlay_and_then(overlay, `Попытавшись успокоить совесть, Вы подробно описали изменения сделанные в задаче и моменты, которые нужно тщательно протестировать. Это точно должно упростить и ускорить процесс QA`);
                        skip_hours(1);
                    }
                }
            } else {
                menu.message("С текущей задачкой покончено!");

                if (menu.button(`Открыть Wrike и взять следующую`)) {
                    open_app(App_Type.wrike);
                    exit_overlay();
                }
            }

            if (menu.button(`Заняться чем-нибудь другим`)) {
                exit_overlay()
            }

            menu.finish();

            allow_exit();

            break;
        }

        case Overlay_Type.code_review: {
            const task = overlay.task;
            if (task.assigned_to.you) break; // TODO bad invariant

            const menu = big_centered_menu();

            if (task.bugs > 5) {
                menu.message(`Вы открыли задачу ${task.assigned_to.teammate.name_genitive} в вечно тормозящем GitPub'e. Код выглядит откровенно плохо`)
            } else if (task.bugs > 2) {
                menu.message(`Вы открыли задачу ${task.assigned_to.teammate.name_genitive} в вечно тормозящем GitPub'e. Код смотрится довольно небрежным`)
            } else {
                menu.message(`Вы открыли задачу ${task.assigned_to.teammate.name_genitive} в вечно тормозящем GitPub'e. На первый взляд, код неплох`)
            }

            if (menu.button("Передать в тестирование не глядя")) {
                pass_task_to_qa(overlay.task, 8);
                message_overlay(`Недолго думая, Вы поставили 'Review OK' и передали задачу в QA. Своей команде Вы все-таки доверяете.`);
            }

            // if (button("Докопаться до кодстайла (1 ч.)")) {
            //     skip_hours(1);
            //     pass_task_to_qa(screen.task);
            // }

            if (menu.button("Тщательно просмотреть код (1 ч.)")) {
                increase_burnout_if_working_past_work_time();
                skip_hours(1);

                if (overlay.task.bugs > 0) {
                    const found_bugs = Math.round((0.5 + Math.random() * 0.5) * overlay.task.bugs);
                    return_task_from_review_to_development(overlay.task, found_bugs);
                    message_overlay(`Тщательно прошерстив код, Вы обнаружили в нем несколько багов и спорных моментов. Задача возвращается обратно к разработчику.`);
                } else {
                    pass_task_to_qa(overlay.task, 8);
                    message_overlay(`Долго щурясь и всматриваясь в код, Вы все-же не смогли найти к чему придраться. Задача отправляется в тестирование`);
                }
            }

            if (menu.button("Подумать еще")) {
                exit_overlay();
            }

            menu.finish();

            allow_exit();

            break;
        }

        case Overlay_Type.game_over: {
            function game_over_message(reason: Game_Over_Reason): string {
                switch (reason) {
                    case Game_Over_Reason.victory:
                        return `Задачка за задачкой уходили в прод и Вы едва успели заметить, как закончился беклог. ` +
                            `Вы сделали это! Дедлайн побежден!` // TODO

                    case Game_Over_Reason.deadline_failed:
                        return `День за днем, неделя за неделей, дедлайн подбирался всё ближе. ` +
                            `Вы уже давно чувствовали, что это случится, но в каком-то рьяном ступоре продолжали работать, ` +
                            `возможно надеясь, что оно как-то само собой рассосется. Не рассосалось. Дедлайн провален. Клиент потерян. Крышка.`;

                    case Game_Over_Reason.fired:
                        return `Ваш компьютер неожиданно заблокировался. ` +
                            `В сотый раз проклиная производителей PearNote Вы попытались вернуться к работе, введя пароль. ` +
                            `Ноутбук все продолжал отрицать легитимность его хозяина, издавая противный звук при каждой неудачной попытке входа. ` +
                            `"Видимо ему совсем кранты", подумали Вы, доставая телефон, чтобы написать инженерам хелпдеска. ` +
                            `На почту упало новое письмо. "Уволен одним днем за неисполнение служебных обязанностей". Что?!`;

                    case Game_Over_Reason.bad_health:
                        return `В последние дни Вы совсем погрузились в работу, игнорируя приемы пищи и сон. ` +
                            `За всем этим Вы и не заметили, как кожа приобрела бледный оттенок, а под глазами появились синие мешки. ` +
                            `Ваши родственники нашли Вас в состоянии обморока прямо у компьютера. ` +
                            `Вы отправляетесь в больницу, о работе можно забыть на следующие пару недель, не говоря уже о приближающемся дедлайне.`;

                    case Game_Over_Reason.burnout:
                        return `Вы уже и забыли, что такое отдых. Закрывая задачу за задачей, Вы не заметили, как все свободное время превратилось в рабочее.` +
                            `В какой-то момент внутри Вас что-то щелкнуло. Зачем Вам вообще это нужно? К чему все эти старания? Куда я двигаюсь?` +
                            `"А пропади оно все пропадом! К черту работу, к черту дедлайн, мне уже все равно!", подумали Вы и купили авиабилет в Саратов, к родителям. Выгорание - это Вам не шутки.`;
                }
            }

            function reason_tip(reason: Game_Over_Reason): string | undefined {
                switch (reason) {
                    case Game_Over_Reason.bad_health: return "Не забывайте есть и достаточно спать";
                    case Game_Over_Reason.burnout: return "Меньше работайте в нерабочее время, в том числе в выходные!";
                    case Game_Over_Reason.fired: return "Следите за посещением обязательным рабочих встреч и багами на продакшне (в вашем инбоксе)"
                }
            }

            const tip = reason_tip(overlay.reason);

            const menu = big_centered_menu(700);
            menu.center_text();
            menu.padding(32);
            menu.message(`${game_over_message(overlay.reason)}\n\nИгра окончена\nСложность: ${difficulty_name(game.difficulty)}\n${deadline_stats_message(true)}\n${tip ? `\nПодсказка: ${tip}\n` : ""}\nПерезагрузите страницу, чтобы начать заново.`);
            menu.finish();

            block_exit();
            break;
        }

        default: unreachable(overlay);
    }
}

function decrease_company_status(penalty: number) {
    game.player.company_status = Math.max(0, game.player.company_status - penalty);

    if (game.player.company_status == 0) {
        show_overlay({ type: Overlay_Type.game_over, reason: Game_Over_Reason.fired });
    }
}

function skip_hours(how_many: number) {
    function one_hour() {
        if (is_work_time()) {
            const worked_this_hour = new Set<Teammate>();

            for (const task of all_tasks()) {
                if (task.status == Task_Status.in_development && !task.assigned_to.you) {
                    if (worked_this_hour.has(task.assigned_to.teammate)) {
                        continue;
                    } else {
                        worked_this_hour.add(task.assigned_to.teammate);
                    }

                    if (task.developer_stuck_hours == 0) {
                        const chance_to_get_stuck = (1.0 - task.assigned_to.teammate.skill_level) * 0.1;

                        if (Math.random() < chance_to_get_stuck && !task.has_already_stuck_once) {
                            const help_messages = [
                                `Я что-то залип с ${task.name}, поможешь?`,
                                `Не могу разобраться с ${task.name} ${random_in_array(["(", "((", "((("])} Можешь помочь?`,
                                `Что-то я совсем застрял на ${task.name}.. Подсобишь?`,
                                `${task.name} оказалась мне не по силам, поможешь?`,
                                `Можем созвониться по ${task.name}? Не могу разобрать одну проблему`
                            ];

                            task.developer_stuck_hours = 6;
                            task.has_already_stuck_once = true;

                            receive_message_from(task.assigned_to.teammate, random_in_array(help_messages));
                        } else {
                            const change_to_introduce_bugs = (1.0 - task.assigned_to.teammate.skill_level) * 0.5;

                            if (Math.random() < change_to_introduce_bugs) {
                                task.bugs++;
                            }

                            task.remaining_work_hours--;
                            task.time_spent++;

                            if (task.remaining_work_hours == 0) {
                                pass_task_to_review(task);

                                game.inbox.push({
                                    type: Inbox_Entry_Type.review_task,
                                    task: task,
                                    read: false,
                                    received_at_hour: game.hour_of_day,
                                    received_at_day_of_week: game.day_of_week
                                });
                            }
                        }
                    } else {
                        task.developer_stuck_hours--;
                        task.time_spent++;

                        if (task.developer_stuck_hours == 0) {
                            const ok_messages = [
                                `Разобрался`,
                                `Всё, сам догнял, сорян`,
                                `Ух, все, допер сам`,
                                `Ага, понял сам в чем проблема, не отвлекаю`,
                                `Осилил сам вроде, если что ещё напишу`
                            ];

                            receive_message_from(task.assigned_to.teammate, `${random_in_array(ok_messages)}${random_in_array(["", " 👌"])}`, true);
                        }
                    }
                }

                if (task.status == Task_Status.in_testing) {
                    task.remaining_work_hours--;

                    if (task.remaining_work_hours == 0) {
                        const bugs_found = Math.floor(Math.random() * task.bugs * 0.7);

                        if (!task.assigned_to.you && bugs_found > 1) {
                            return_task_from_qa_to_development(task, bugs_found);
                        } else {
                            deploy_task(task);
                        }
                    }
                }

                if (task.status == Task_Status.in_review && task.assigned_to.you) {
                    task.remaining_work_hours--;

                    if (task.remaining_work_hours == 0) {
                        if (task.instructions_for_qa_written) {
                            pass_task_to_qa(task, 2);
                        } else {
                            pass_task_to_qa(task, 8);
                        }
                    }
                }
            }
        }

        for (const task of game.backlog) {
            if (task.status == Task_Status.done && task.bugs > 0 && task.can_backfire_on_prod && !task.defects_found_on_prod) {
                const chance_to_find_defects = task.bugs * 0.03;

                if (Math.random() > chance_to_find_defects) {
                    task.defects_found_on_prod = true;
                    game.inbox.push({
                        type: Inbox_Entry_Type.production_bug,
                        task: task,
                        hours_remaining: 72,
                        read: false,
                        received_at_hour: game.hour_of_day,
                        received_at_day_of_week: game.day_of_week
                    });
                }
            }
        }

        for (const entry of game.inbox) {
            if (entry.type == Inbox_Entry_Type.production_bug && !entry.read) {
                if (entry.hours_remaining > 0) {
                    entry.hours_remaining--;
                } else {
                    decrease_company_status(3);
                }
            }
        }

        game.hour_of_day++;

        for (const event of game.today_events) {
            if (game.hour_of_day == event.start_hour + event.duration) {
                if (event.type == Calendar_Event_Type.daily_standup && !game.player.attended_meetings_today.includes(Calendar_Event_Type.daily_standup)) {
                    for (const teammate of game.team) {
                        const task = find_first_assigned_task_in_dev(teammate);

                        if (!task) {
                            const new_random_task = random_in_array(free_tasks().slice(0, 10));

                            if (new_random_task) {
                                assign_task(new_random_task, {you: false, teammate: teammate});
                            }
                        }
                    }
                }

                const meeting_miss_penalty: Record<Calendar_Event_Type, number> = {
                    [Calendar_Event_Type.candidate_interview]: 15,
                    [Calendar_Event_Type.one_on_one]: 3,
                    [Calendar_Event_Type.lead_meeting]: 5,
                    [Calendar_Event_Type.daily_standup]: 5,

                    [Calendar_Event_Type.knowledge_sharing]: 0,
                    [Calendar_Event_Type.lunch]: 0
                };

                if (!game.player.attended_meetings_today.includes(event.type)) {
                    decrease_company_status(meeting_miss_penalty[event.type]);
                }
            }
        }

        if (game.hour_of_day == 24) {
            game.hour_of_day = 0;
            game.day++;

            if (game.day == game.deadline_day) {
                show_overlay({ type: Overlay_Type.game_over, reason: Game_Over_Reason.deadline_failed });
            }

            if (game.day_of_week == week_days) {
                game.day_of_week = 1;
            } else {
                game.day_of_week++;
            }

            game.player.attended_meetings_today = [];
            refresh_events_for_today();
        }

        game.player.health = Math.max(0, game.player.health - 3);

        if (game.player.health == 0) {
            show_overlay({ type: Overlay_Type.game_over, reason: Game_Over_Reason.bad_health });
        }
    }

    for (let hour = 0; hour < how_many; hour++) one_hour();
}

function find_first_assigned_task_in_dev(teammate: Teammate): By_Status<Task, Task_Status.in_development> | undefined {
    for (const task of game.backlog) {
        if (task.status == Task_Status.in_development && !task.assigned_to.you && task.assigned_to.teammate == teammate) {
            return task;
        }
    }
}

function find_your_first_current_task_in_dev(): By_Status<Task, Task_Status.in_development> | undefined {
    for (const task of game.backlog) {
        if (task.status == Task_Status.in_development && task.assigned_to.you) {
            return task;
        }
    }
}

function task_ui(task: Task) {
    return `${task.name} [${Task_Status[task.status]}${task.status == Task_Status.in_development ? " " + `h: ${task.remaining_work_hours.toFixed(1)}, b: ${task.bugs}` : ""}]`;
}

function get_app_notifications(app: App): number {
    switch (app.type) {
        case App_Type.clndr: {
            return game.today_events.some(event => event.start_hour == game.hour_of_day) ? 1 : 0;
        }

        case App_Type.limp: {
            return game.team.map(teammate => teammate.messages.length - teammate.messages_read).reduce((l, r) => l + r, 0);
        }

        case App_Type.wrike: {
            // TODO @Hack ?
            return game.inbox.map(entry => entry.read ? 0 : 1 as number).reduce((l, r) => l + r, 0);
        }

        default: return 0;
    }
}

function draw_app(app: App) {
    function center_cursor(w: number, h: number) {
        set_layout_cursor(game.canvas_width / 2 - w / 2, game.canvas_height / 2 - h / 2);
    }

    switch (app.type) {
        case App_Type.code_junkie: {
            const w = 1100, h = 600;

            push_layout(Layout_Type.absolute);
            center_cursor(w, h);

            draw_window(w, h, "Code Junkie",() => {
                draw_code_editor(w, h);
            });

            pop_layout();
            break;
        }

        case App_Type.limp: {
            const w = 900, h = 450;

            push_layout(Layout_Type.absolute);
            center_cursor(w, h);

            draw_window(w, h, "Limp Messenger",() => {
                draw_messenger(app, w, h);
            });

            pop_layout();

            break;
        }

        case App_Type.wrike: {
            const w = 1260, h = 620;

            push_layout(Layout_Type.absolute);
            center_cursor(w, h);

            draw_window(w, h, "Wrike",() => {
                draw_wrike(app, w, h);
            });

            pop_layout();
            break;
        }

        case App_Type.clndr: {
            const w = 500, h = 420;

            push_layout(Layout_Type.absolute);
            center_cursor(w, h);

            draw_window(w, h, "Clndr",() => {
                draw_calendar(w);
            });

            pop_layout();
            break;
        }

        case App_Type.iron: {
            const w = 900, h = 450;

            push_layout(Layout_Type.absolute);
            center_cursor(w, h);

            draw_window(w, h, "Iron Browser",() => {
                draw_browser(w, h);
            });

            pop_layout();

            break;
        }

        default: unreachable(app);
    }
}

function health_label(health: number) {
    if (health > 80) return "Отличное";
    if (health > 60) return "Хорошее";
    if (health > 40) return "Неважное";
    if (health > 20) return "Плохое";
    if (health > 0) return "Отвратительное";
    return "Обморок";
}

function company_status_label(status: number) {
    if (status > 80) return "Отличное";
    if (status > 60) return "HR'ы начинают что-то подозревать";
    if (status > 40) return "С Вашим менеджером ведутся разговоры";
    if (status > 20) return "Оформляется Personal Improvement Plan";
    if (status > 0) return "Подписываются бумаги об увольнении";
    return "Уволен";
}

function burnout_label(burnout: number) {
    if (burnout == 100) return "Выгорел";
    if (burnout > 80) return "Близко к выгоранию";
    if (burnout > 60) return "Работа вызывает отвращение";
    if (burnout > 40) return "Не хочется вставать по утрам";
    if (burnout > 20) return "Легкое раздражение от работы";
    return "Отличное";
}

function do_one_frame() {
    game.font_stack = [];
    game.context_stack = [];
    game.layout_stack = [{
        type: Layout_Type.vertical,
        cursor: xy(30, 30)
    }];

    game.mouse.scroll_y = game.mouse.scroll_y + (game.mouse.target_scroll_y - game.mouse.scroll_y) * 0.3;

    push_context(game.main_ctx);
    push_font(18);

    game.out.clearRect(0, 0, game.canvas_width * game.dpi_scale, game.canvas_height * game.dpi_scale);
    game.main_ctx.clearRect(0, 0, game.canvas_width, game.canvas_height);
    game.overlay_ctx.clearRect(0, 0, game.canvas_width, game.canvas_height);

    const ctx = current_context();

    if (game.hour_of_day < 18 && game.hour_of_day > 6) {
        ctx.drawImage(images.background_day.img, 0, 0, game.canvas_width, game.canvas_height);
    } else {
        ctx.drawImage(images.background_night.img, 0, 0, game.canvas_width, game.canvas_height);
    }

    ctx.textBaseline = "middle";
    game.overlay_ctx.textBaseline = "middle";

    push_context(game.overlay_ctx);
    draw_overlay_screen();
    pop_context();

    ctx.fillStyle = "#fff"
    ctx.shadowBlur = 3;
    ctx.shadowColor = "#000";
    label(`Физическое здоровье: ${health_label(game.player.health)}`);
    label(`Ментальное здоровье: ${burnout_label(game.player.burnout)}`);
    label(`Положение в компании: ${company_status_label(game.player.company_status)}`);
    label(`Производительность: ${game.player.productivity}%`);
    ctx.shadowBlur = 0;

    push_size(50);

    if (dev_mode) {
        const current = find_your_first_current_task_in_dev();

        if (current) {
            label(task_ui(current));
        }

        if (button("Health = 5")) {
            game.player.health = 5;
        }

        if (button("Burnout = 95")) {
            game.player.burnout = 95;
        }

        if (button("Skip 3 hours")) {
            skip_hours(3);
        }
    }

    draw_top_bar(game.canvas_width);

    push_layout(Layout_Type.absolute);
    const dock_width = 420; // Blaze it
    const dock_height = 100;
    set_layout_cursor(game.canvas_width / 2 - dock_width / 2, game.canvas_height - dock_height + 10);
    draw_dock(dock_width, dock_height);
    pop_layout();

    push_size(500);

    if (game.current_app) {
        draw_app(game.current_app);
    }

    const target_blur = game.overlay.type == Overlay_Type.none ? 0 : 2;

    game.blur = game.blur + (target_blur - game.blur) * 0.1;

    if (game.blur > 0.1) {
        game.out.filter = `blur(${game.blur}px)`;
    }

    game.out.drawImage(game.main_ctx.canvas, 0, 0);
    game.out.filter = "none";
    game.out.drawImage(game.overlay_ctx.canvas, 0, 0);
    game.out.canvas.style.cursor = game.any_button_hovered_this_frame ? "pointer" : "default";

    game.mouse.target_scroll_y = 0;
    game.mouse.clicked = false;
    game.any_button_clicked_this_frame = false;
    game.any_button_hovered_this_frame = false;
}

function start_animation_frame_loop(time: number) {
    requestAnimationFrame(time => start_animation_frame_loop(time));

    game.frame_time = time - game.time;
    game.time = time;
    do_one_frame();
}

function fix_canvas_dpi_scale(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, scale = true) {
    const width = canvas.width;
    const height = canvas.height;

    const devicePixelRatio = window.devicePixelRatio ?? 1;
    const backingStoreRatio = 1; //context.backingStorePixelRatio || 1
    const ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    } else {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = '';
        canvas.style.height = '';
    }

    if (scale) {
        context.scale(ratio, ratio);
    }

    return ratio;
}

function random_up_to(x: number) {
    return Math.floor(Math.random() * x);
}

function random_in_array<T>(input: T[]): T {
    return input[random_up_to(input.length)];
}

function pick_n_random_skills(skills: Skill[], how_many: number) {
    const picked: Skill[] = [];

    for (let index = 0; index < how_many; index++) {
        const skill_index = random_up_to(skills.length);
        picked.push(...skills.splice(skill_index, 1));
    }

    return picked;
}

function generate_team(): Teammate[] {
    const available_avatars = shuffle([...images.people])
    const available_skills = all_skills();

    function shuffle<T>(input: T[]) {
        for (let index = input.length - 1; index > 0; index--) {
            const random_index = Math.floor(Math.random() * (index + 1));
            const swapped = input[index];
            input[index] = input[random_index];
            input[random_index] = swapped;
        }

        return input;
    }

    function pick_avatar() {
        const avatar = available_avatars.pop();
        if (!avatar) throw "Avatar not found";
        return avatar;
    }

    function base(how_many_skills: number) {
        const titles = [
            "connoisseur",
            "master",
            "jedi",
            "ninja",
            "enthusiast",
            "specialist",
            "expert",
            "guru",
            "wizard",
            "nerd"
        ];

        const skills = pick_n_random_skills(available_skills, how_many_skills);
        const title = skills.map(skill => {
            const random_title = titles.splice(random_up_to(titles.length), 1)[0];
            return `${skill_name(skill)} ${random_title}`;
        }).join(", ");

        return {
            avatar: pick_avatar(),
            skills: skills,
            skill_title: title,
            messages_read: 0,
            messages: []
        }
    }

    return [{
        ...base(2),
        name: "Иван",
        name_genitive: "Ивана",
        name_dative: "Ивану",
        skill_level: 0.7
    }, {
        ...base(2),
        name: "Вася",
        name_genitive: "Васи",
        name_dative: "Васе",
        skill_level: 0.5
    }, {
        ...base(1),
        name: "Дима",
        name_genitive: "Димы",
        name_dative: "Диме",
        skill_level: 0.3,
    }/*, {
        name: "Лёша",
        name_genitive: "Лёши",
        name_dative: "Лёше",
        skill_level: 0.1
    }*/];
}

const words = {
    verbs: [
        "Implement",
        "Research",
        "Add",
        "Support",
        "Fix",
        "Change",
        "Improve",
        "Optimize",
        "Integrate",
        "Enable"
    ],
    adjectives: [
        "adaptive",
        "progressive",
        "directional",
        "borderless",
        "seamless",
        "intuitive",
        "selectable",
        "persistent",
        "contextual",
        "third party",
        "stateful",
        "stateless",
        "sharded"
    ],
    nouns: [
        "navigation",
        "browsing",
        "file attachments",
        "sharing",
        "editing",
        "collaboration",
        "comments",
        "administration",
        "selection",
        "uploads",
        "updates",
        "permalinks",
        "dashboards",
        "stacking",
        "accounts"
    ]
};

const knowledge_sharing_topics = new Set<string>();

function generate_knowledge_sharing_topic() {
    while (true) {
        const name = `${random_in_array(words.adjectives)} ${random_in_array(words.nouns)}`;

        if (!knowledge_sharing_topics.has(name)) {
            knowledge_sharing_topics.add(name);
            return name;
        }
    }
}

function generate_backlog(team_size: number, days_until_deadline: number, difficulty_multiplier: number): Task[] {
    let remaining_task_hours = Math.ceil((days_until_deadline * team_size * (work_end_hour - work_start_hour)) * difficulty_multiplier);

    const generated_names = new Set<string>();

    function generate_task_name(): string {
        while (true) {
            const name = `${random_in_array(words.verbs)} ${random_in_array(words.adjectives)} ${random_in_array(words.nouns)}`;

            if (!generated_names.has(name)) {
                generated_names.add(name);
                return name;
            }
        }
    }

    function generate_task(): Task {
        const random_hours = 3 + Math.ceil(Math.random() * 7);
        const capped_hours = Math.min(remaining_task_hours, random_hours);
        const how_many_skills_required = Math.round(Math.random() * 3);

        function required_skills_in_brackets(skills: Skill[]) {
            const text = skills.map(skill_name).map(name => `[${name}]`).join("");

            if (text.length == 0) {
                return "";
            } else {
                return `${text} `;
            }
        }

        const required_skills = pick_n_random_skills(all_skills(), how_many_skills_required);
        const generated_name = generate_task_name();

        return {
            name: generated_name,
            full_name: `${required_skills_in_brackets(required_skills)}${generated_name}`,
            estimated_time: capped_hours,
            status: Task_Status.new,
            required_skills: required_skills,
            time_spent: 0
        }
    }

    const tasks: Task[] = [];

    while (remaining_task_hours > 0) {
        const task = generate_task();

        remaining_task_hours -= task.estimated_time;

        tasks.push(task);
    }

    return tasks;
}

function day_of_week_starts(day: Day_Of_Week) {
    switch (day) {
        case 1: return "Наступил понедельник";
        case 2: return "Наступил вторник";
        case 3: return "Наступила среда";
        case 4: return "Наступил четверг";
        case 5: return "Наступила пятница";
        case 6: return "Наступила суббота";
        case 7: return "Наступило воскресенье";
    }
}

function day_of_week_name(day: Day_Of_Week) {
    switch (day) {
        case 1: return "Понедельник";
        case 2: return "Вторник";
        case 3: return "Среда";
        case 4: return "Четверг";
        case 5: return "Пятница";
        case 6: return "Суббота";
        case 7: return "Воскресенье";
    }
}

function generate_candidate_name() {
    const first_names = [
        "Авдей",
        "Авксентий",
        "Агафон",
        "Акакий",
        "Александр",
        "Владлен",
        "Влас",
        "Всеволод",
        "Вячеслав",
        "Макар",
        "Максим",
        "Марк",
        "Матвей",
        "Тарас",
        "Тимофей",
        "Тимур",
        "Святослав",
        "Севастьян",
        "Семён",
        "Серафим",
        "Сергей",
        "Павел",
        "Паисий",
        "Панкратий",
        "Пантелеймон",
        "Парфений"
    ];

    const last_names = [
        "Сафонов",
        "Капустин",
        "Кириллов",
        "Моисеев",
        "Елисеев",
        "Кошелев",
        "Костин",
        "Горбачёв",
        "Орехов",
        "Ефремов",
        "Исаев",
        "Евдокимов",
        "Калашников",
        "Кабанов",
        "Носков",
        "Юдин",
        "Кулагин",
        "Лапин",
        "Прохоров",
        "Нестеров",
        "Харитонов",
        "Агафонов",
        "Муравьёв",
        "Ларионов",
        "Федосеев",
        "Зимин",
        "Пахомов"
    ];

    return `${random_in_array(first_names)} ${random_in_array(last_names)}`;
}

function refresh_events_for_today() {
    game.today_events.length = 0;

    if (game.day_of_week <= work_days) {
        game.today_events.push({
            type: Calendar_Event_Type.daily_standup,
            duration: 1,
            start_hour: 10
        });
    }

    game.today_events.push({
        type: Calendar_Event_Type.lunch,
        duration: 1,
        start_hour: 13
    });

    if (game.day_of_week == 1) {
        game.today_events.push({
            type: Calendar_Event_Type.one_on_one,
            start_hour: 14,
            duration: 1,
            teammate: game.team[0]
        });
    }

    if (game.day_of_week == 2) {
        game.today_events.push({
            type: Calendar_Event_Type.lead_meeting,
            duration: 1,
            start_hour: 14
        });
    }

    if (game.day_of_week == 3) {
        game.today_events.push({
            type: Calendar_Event_Type.one_on_one,
            start_hour: 14,
            duration: 1,
            teammate: game.team[1]
        });

        game.today_events.push({
            type: Calendar_Event_Type.candidate_interview,
            duration: 2,
            start_hour: 16,
            candidate_name: generate_candidate_name()
        });
    }

    if (game.day_of_week == 4) {
        game.today_events.push({
            type: Calendar_Event_Type.knowledge_sharing,
            start_hour: 16,
            duration: 1,
            topic: generate_knowledge_sharing_topic()
        });
    }

    if (game.day_of_week == 5) {
        game.today_events.push({
            type: Calendar_Event_Type.one_on_one,
            start_hour: 14,
            duration: 1,
            teammate: game.team[2]
        });
    }

}

function is_past_event(event: Calendar_Event) {
    return game.hour_of_day >= event.start_hour + event.duration;
}

function all_apps(): App[] {
    return [{
        type: App_Type.wrike,
        dock_hover_time: 0,
        task_list_scroll_y: 0,
        inbox_scroll_y: 0
    }, {
        type: App_Type.clndr,
        dock_hover_time: 0,
    }, {
        type: App_Type.limp,
        dock_hover_time: 0,
    }, {
        type: App_Type.code_junkie,
        dock_hover_time: 0
    }, {
        type: App_Type.iron,
        dock_hover_time: 0
    }];
}

function start_game() {
    const canvas_element = document.getElementById("canvas");

    if (!canvas_element) {
        throw "Malformed page";
    }

    const backing_canvas = (canvas_element as HTMLCanvasElement);
    const backing_context = backing_canvas.getContext("2d", { alpha: false });

    if (!backing_context) {
        throw "Unable to create draw context";
    }

    const base_width = backing_canvas.width;
    const base_height = backing_canvas.height;

    // backing_context.translate(0.5, 0.5);

    function create_additional_context(alpha = true): CanvasRenderingContext2D {
        const element = document.createElement('canvas');
        element.width = backing_canvas.width;
        element.height = backing_canvas.height;

        console.log("Created canvas", element.width, element.height);

        const context = element.getContext('2d', { alpha: alpha });

        if (!context) {
            throw "Unable to create draw context";
        }

        fix_canvas_dpi_scale(element, context);
        // context.translate(0.5, 0.5);

        return context;
    }

    const overlay_ctx = create_additional_context();
    const main_ctx = create_additional_context(false);

    const scale = fix_canvas_dpi_scale(backing_canvas, backing_context, false);

    const days_until_deadline = 26;

    game = {
        canvas_width: base_width,
        canvas_height: base_height,
        out: backing_context,
        main_ctx: main_ctx,
        overlay_ctx: overlay_ctx,
        any_button_clicked_this_frame: false,
        any_button_hovered_this_frame: false,
        mouse: {
            x: 0,
            y: 0,
            button: 0,
            clicked: false,
            target_scroll_y: 0,
            scroll_y: 0
        },
        layout_stack: [],
        font_stack: [],
        context_stack: [],
        clip_stack: new WeakMap(),
        time: 0,
        frame_time: 0,
        blur: 0,
        dpi_scale: scale,

        difficulty: Difficulty.junior,
        day: 0,
        deadline_day: days_until_deadline,
        day_of_week: 1,
        hour_of_day: work_start_hour,

        player: {
            burnout: 0,
            health: 100,
            company_status: 100,
            productivity: 100,
            attended_meetings_today: []
        },

        overlay_shown_at: 0,

        backlog: [],
        overlay: {
            type: Overlay_Type.lang
        },
        team: generate_team(),
        today_events: [],
        inbox: [],
        apps: all_apps()
    };

    refresh_events_for_today();

    const cursor_position_on_canvas = (event: MouseEvent) => {
        const transform = backing_context.getTransform().inverse();

        const rect = backing_canvas.getBoundingClientRect();
        const scale_x = backing_canvas.width / rect.width;
        const scale_y = backing_canvas.height / rect.height;

        return transform.transformPoint({
            x: (event.clientX - rect.left),// * scale_x,
            y: (event.clientY - rect.top)// * scale_y
        });
    };

    backing_canvas.addEventListener("mousedown", event => {
        const real_position = cursor_position_on_canvas(event);

        const mouse = game.mouse;
        mouse.clicked = true;
        mouse.x = real_position.x;
        mouse.y = real_position.y;
        mouse.button = event.button;
    });

    backing_canvas.addEventListener("mousemove", event => {
        const real_position = cursor_position_on_canvas(event);

        const mouse = game.mouse;
        mouse.x = real_position.x;
        mouse.y = real_position.y;
    });

    backing_canvas.addEventListener("wheel", event => {
        const mouse = game.mouse;
        mouse.target_scroll_y = event.deltaY;
    })

    backing_canvas.addEventListener("contextmenu", event => event.preventDefault());

    start_animation_frame_loop(0);
}

start_game();
