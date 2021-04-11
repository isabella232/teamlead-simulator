# Local dev

`node watch` for initial compilation and to watch for changes

`node serve` to start local server

`node generate-declarations` to update declarations for localization strings

Game will start at http://127.0.0.1:3333/

# Game

## Objective
Complete all tasks before deadline

## Game loop
1. Each week consists of 5 work days and 2 weekends
2. Each day is split into 24 hours
3. Player actions advance time in 1-hour increments
4. Work starts at 10:00 and ends at 18:00
5. At all times, player has access to apps on their laptop
    1. Wrike
    2. Calendar
    3. Messenger
    4. IDE
    5. Browser
6. Player can finish their day at any point and skip time until 10:00 the next day
7. With each hour passing `health` decreased by 3
8. After player ends their day, each hour skipped increased `health` by 4
9. Player has a team of randomly generated coworkers with randomly generated skillset

### Player stats
1. `health` - starts at 100, game over if it reaches 0
2. `company status` - starts at 100, game over if it reaches 0
3. `burnout` - starts at 0, game over if it reaches 100
4. `productivity` - starts at 100, decreases time it takes to complete `tasks`

### Apps
1. Wrike
    1. Table View
       1. List of all `tasks` for this project, their statuses and assignees
       2. This is where player can take on new `tasks`
    2. Inbox
        1. List of messages requiring player attention
            1. `Task` requires your review
            2. Bug discovered on production
               1. Bugs have a completion deadline, after which they will decrease `company status` each hour
            3. `Task` was returned to development from QA
2. Calendar
    1. Events which player can attend
    2. Skipping events decreases `company status`
    3. Possible events
        1. Daily Standup - 1h, daily
           - See Daily Standup section
        2. One on One - 1h, twice per week
           - Increases teammate `skill level`
        3. Candidate Inteview - 2h, once per week
        4. Lead Meeting - 1h, once per week
        5. Knowledge sharing, 1h, once per week
           - Increases `productivity`
        6. Lunch - 1h, daily
            - Increases `health`
3. Messenger
    1. Allows answering to your teammate messages
    2. Whenever a teammate is `stuck` with a `task`, they will message player
4. IDE
    1. Allows working on current assigned `task` in 1h increments
        - Work done per hour is increased based on `productivity`
        - Every hour worked randomly adds `bugs` to the `task` code
    2. When a `task` is done, player can
        1. Write instructions for QA
           - Decreases time `task` is in `In Testing` status
        2. Cover code with tests
            - Eliminates some `bugs`
        3. Pass it to review
            - Reviews of player `tasks` take fixed time and always pass
    4. Working after work hours increases `burnout`
5. Browser
    1. Spend time on Jabr. Increases `productivity`
    2. Spend time on YouCube. Decreases `burnout`
    
### Tasks
1. Estimated time
2. Work done
3. Array of required `skills`
4. Status
    1. New
    2. In Development
    3. In Review
    4. In Testing
    5. Done

### Skills
1. Dart
2. TypeScript
3. JavaScript
4. Java
5. SQL
6. CSS

### Teammates
1. Each teammate has a random skill level based on game difficulty
2. Teammates have different random `skills`
3. Work
    1. Each hour of work day teammates work on tasks assigned to them
    2. Based on skill level, teammate can become `stuck` for a random amount of hours
        1. When that happens, they message player in Messenger, asking for help
        2. Player can spend 1h to remove the `stuck` status
        3. Otherwise the status is removed once the required number of hours pass

### Daily Standup
1. Each teammate reports on the status of their currently assigned `task`
    1. Continue working on `task` if it isn't done
    2. Report being `stuck` on the `task`
    3. Report that `task` is completed
        1. Player can select which `task` a teammate can take from top backlog `tasks`
        2. After selecting a `task` it's transferred to `In Development` and assigned to that teammate
        3. For each skill required in `task` but not possessed by teammate, that `task`'s estimated time increases
2. If player skips the meeting, teammates take `tasks` randomly

