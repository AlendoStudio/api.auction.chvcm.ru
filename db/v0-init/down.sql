--  ____                 __                        ____    _____   __
-- /\  _`\              /\ \__                    /\  _`\ /\  __`\/\ \
-- \ \ \L\ \___     ____\ \ ,_\    __   _ __    __\ \,\L\_\ \ \/\ \ \ \
--  \ \ ,__/ __`\  /',__\\ \ \/  /'_ `\/\`'__\/'__`\/_\__ \\ \ \ \ \ \ \  __
--   \ \ \/\ \L\ \/\__, `\\ \ \_/\ \L\ \ \ \//\  __/ /\ \L\ \ \ \\'\\ \ \L\ \
--    \ \_\ \____/\/\____/ \ \__\ \____ \ \_\\ \____\\ `\____\ \___\_\ \____/
--     \/_/\/___/  \/___/   \/__/\/___L\ \/_/ \/____/ \/_____/\/__//_/\/___/
--                                 /\____/                               v10
--                                 \_/__/                Font Name: Larry 3D

DROP VIEW employees;
DROP VIEW entities;

-- DROP TABLE broadcast_email_lots;

DROP TABLE lot_participants;
DROP TABLE lots;
DROP TABLE stuff_translations;
DROP TABLE stuffs;

DROP TABLE tokens_tfa_email;
DROP TABLE tokens_tfa_purgatory;
DROP TABLE tokens_tfa_recovery;
DROP TABLE tokens_password_reset;

DROP TABLE attachments;
DROP TABLE users_employees;
DROP TABLE users_entities;
DROP TABLE users_common;

DROP TYPE USER_TYPE;
DROP TYPE LANGUAGE_CODE;
DROP TYPE LOT_TYPE;
DROP TYPE LOT_AMOUNT_TYPE;
DROP TYPE CURRENCY;

DROP FUNCTION employees_insert_update_delete_trigger();
DROP FUNCTION entities_insert_update_delete_trigger();
DROP FUNCTION lots_update_trigger();
DROP FUNCTION abs_interval(INTERVAL);

--             ( ____     .-.
--      .-""-. .'` _  `'-,//`|-.
--     / ,-'-.`.  | \     `. (  `\
--    |       `   \  \      `.)   \
--    |            \_@    .=` \    |
--    |      /               .=\    \
--    |     /                   \    |
--    |    .\    ,____         ==;   |
--    \  __.-;.__.'--'`"-,       |   |
--     `"`  /           _ \    '=|   |
--         |         _.' \_)     /   /
--         |  \     (  _    '=_.'   |
--         \   \   .-`` `---'`      |              _
--          \   \ | =   ,      ,   /            ,_( ))
--           )   `|     \__.-'`   /              \' /  .--.
--           /`   |nnn  / \      /              =/ \  (
--    jgs   /     ;""""`nn|     (                \_ \  )
--         (nnn__.'       '-nnn-'               _(   |`
--                                              `"""`
