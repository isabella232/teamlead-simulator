declare module "ru.properties" {
    type Keys = {
        overlay: {
            intro: {
                header(arg: { team: string }): string;
                difficulty(arg: { difficulty: string }): string;
                teammate(arg: { name: unknown, skills: string }): string;
            }
            editor: {
                nothing_done(): string;
                lots_of_work(): string;
                mostly_done(): string;
                almost_there(): string;
                done(): string;
                work_on_task(): string;
                work_done_1(): string;
                work_done_2(): string;
                work_done_3(): string;
                work_done_4(): string;
                passed_to_review(): string;
                tests_done(): string;
                qa_instructions_done(): string;
                task_done(): string;
                action: {
                    pass_to_review(): string;
                    write_tests(): string;
                    write_qa_instructions(): string;
                    open_wrike_to_take_new_task(): string;
                    do_something_else(): string;
                }
            }
            code_review: {
                look_at_code: {
                    bad(arg: { name: unknown }): string;
                    not_too_bad(arg: { name: unknown }): string;
                    ok(arg: { name: unknown }): string;
                }
                passed_to_qa_without_looking(): string;
                found_bugs(): string;
                couldnt_find_bugs(): string;
                action: {
                    pass_to_qa_without_looking(): string;
                    look_at_code(): string;
                    do_something_else(): string;
                }
            }
            standup: {
                you: {
                    name(): string;
                    working_on(arg: { task: string }): string;
                    will_take_next_task(): string;
                }
                teammate: {
                    worked_on: {
                        v1(): string;
                        v2(): string;
                        v3(): string;
                        v4(): string;
                        v5(): string;
                        v6(): string;
                        v7(): string;
                        base(arg: { worked_on: string, task: string }): string;
                        stuck(arg: { worked_on: string, task: string }): string;
                        finishing_soon(arg: { worked_on: string, task: string }): string;
                    }
                    finished_all_tasks: {
                        v1(): string;
                        v2(): string;
                        v3(): string;
                        v4(): string;
                        v5(): string;
                    }
                }
                action: {
                    continue(): string;
                    suggest_task(arg: { task: string, estimated_time: string }): string;
                    continue_no_free_tasks(): string;
                    assign_to_yourself(arg: { task: string, estimated_time: string }): string;
                }
                finished(): string;
            }
            calendar: {
                lunch: {
                    message(arg: { food: string }): string;
                    food: {
                        v1(): string;
                        v2(): string;
                        v3(): string;
                        v4(): string;
                        v5(): string;
                        v6(): string;
                        v7(): string;
                    }
                }
                standup: {
                    info(): string;
                }
                one_on_one: {
                    info(): string;
                    message(arg: { name: unknown }): string;
                }
                knowledge_sharing: {
                    info(arg: { topic: string }): string;
                    message(arg: { topic: string }): string;
                }
                interview: {
                    info(): string;
                    message(arg: { candidate_name: string }): string;
                }
                lead_meeting: {
                    info(): string;
                    message(): string;
                }
                already_started(): string;
                already_finished(): string;
                not_started_yet(): string;
                action: {
                    lunch(): string;
                    standup(): string;
                    one_on_one(): string;
                    knowledge_sharing(): string;
                    interview(): string;
                    lead_meeting(): string;
                    do_something_else(): string;
                }
            }
            teammate: {
                action: {
                    help(arg: { name: unknown }): string;
                }
                helped(arg: { name: unknown }): string;
                nothing_to_talk_about(): string;
                cant_talk_after_work(arg: { name: unknown }): string;
            }
            task: {
                status: {
                    not_started(): string;
                    in_dev: {
                        you(): string;
                        teammate(arg: { name: unknown }): string;
                    }
                    in_review: {
                        yours(): string;
                        teammate(arg: { name: unknown }): string;
                    }
                    in_testing(): string;
                    done(): string;
                }
                action: {
                    go_to_editor(): string;
                    go_to_review(): string;
                    assign_to_you(): string;
                }
            }
            inbox: {
                review_info(): string;
                returned_to_dev(): string;
                production_bug(arg: { num_bugs: string }): string;
                production_bug_fixed(): string;
                action: {
                    review(): string;
                    mark_as_read(): string;
                    fix_bugs(): string;
                    do_something_else(): string;
                }
            }
            browser: {
                jabr(): string;
                jabr_read(): string;
                you_cube(): string;
                you_cube_watched(arg: { video: string }): string;
                video: {
                    v1(): string;
                    v2(): string;
                    v3(): string;
                    v4(): string;
                    v5(): string;
                    v6(): string;
                    v7(): string;
                    v8(): string;
                    v9(): string;
                }
                action: {
                    read_jabr(): string;
                    you_cube(): string;
                }
            }
            computer: {
                finish_work_for_today(): string;
            }
            weekend: {
                day: {
                    mon(): string;
                    tue(): string;
                    wed(): string;
                    thu(): string;
                    fri(): string;
                    sat(): string;
                    sun(): string;
                }
                message(arg: { day_started: string }): string;
                action: {
                    rest(): string;
                    do_something_else(): string;
                }
            }
            game_over: {
                reason: {
                    victory(): string;
                    deadline_failed(): string;
                    fired(): string;
                    bad_health(): string;
                    burnout(): string;
                }
                tip: {
                    bad_health(): string;
                    burnout(): string;
                    fired(): string;
                }
                message: {
                    header(): string;
                    difficulty(arg: { difficulty: string }): string;
                    tip(arg: { tip: string }): string;
                    restart(): string;
                }
            }
        }
        top_bar: {
            day: {
                mon(): string;
                tue(): string;
                wed(): string;
                thu(): string;
                fri(): string;
                sat(): string;
                sun(): string;
            }
            today(arg: { day: number, day_of_week: string }): string;
            finish_work_tip(): string;
        }
        assigned_to_you(): string;
        difficulty: {
            junior(): string;
            middle(): string;
            senior(): string;
            teamlead(): string;
        }
        deadline_stats: {
            days_until(arg: { days: number }): string;
            tasks_remaining(arg: { tasks: number, total: string }): string;
            backlog(arg: { tasks: number }): string;
        }
        status: {
            health: {
                perfect(): string;
                good(): string;
                fine(): string;
                bad(): string;
                terrible(): string;
                zero(): string;
            }
            company: {
                perfect(): string;
                good(): string;
                fine(): string;
                bad(): string;
                terrible(): string;
                zero(): string;
            }
            burnout: {
                perfect(): string;
                good(): string;
                fine(): string;
                bad(): string;
                terrible(): string;
                zero(): string;
            }
            label: {
                health(): string;
                burnout(): string;
                company(): string;
                performance(): string;
            }
        }
        chat: {
            action: {
                message_teammate(arg: { name: unknown }): string;
            }
            greetings: {
                v1(): string;
                v2(): string;
                v3(): string;
                v4(): string;
                v5(): string;
            }
            thanks: {
                v1(): string;
                v2(): string;
                v3(): string;
            }
            figured_out: {
                v1(): string;
                v2(): string;
                v3(): string;
                v4(): string;
                v5(): string;
            }
            help: {
                v1(arg: { task_name: string }): string;
                v2(arg: { task_name: string, sadness: number }): string;
                v3(arg: { task_name: string }): string;
                v4(arg: { task_name: string }): string;
                v5(arg: { task_name: string }): string;
            }
        }
        teammate: {
            name_nom_gen_dat: {
                v1(): string;
                v2(): string;
                v3(): string;
                v4(): string;
                v5(): string;
            }
        }
        candidate: {
            first_names(): string;
            last_names(): string;
        }
    }
    
    const def: Keys;
    export default def;
}