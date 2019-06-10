--  ____                 __                        ____    _____   __
-- /\  _`\              /\ \__                    /\  _`\ /\  __`\/\ \
-- \ \ \L\ \___     ____\ \ ,_\    __   _ __    __\ \,\L\_\ \ \/\ \ \ \
--  \ \ ,__/ __`\  /',__\\ \ \/  /'_ `\/\`'__\/'__`\/_\__ \\ \ \ \ \ \ \  __
--   \ \ \/\ \L\ \/\__, `\\ \ \_/\ \L\ \ \ \//\  __/ /\ \L\ \ \ \\'\\ \ \L\ \
--    \ \_\ \____/\/\____/ \ \__\ \____ \ \_\\ \____\\ `\____\ \___\_\ \____/
--     \/_/\/___/  \/___/   \/__/\/___L\ \/_/ \/____/ \/_____/\/__//_/\/___/
--                                 /\____/                               v11
--                                 \_/__/                Font Name: Larry 3D

DROP VIEW employees;
DROP VIEW entities;

DROP TABLE lot_participants;
DROP TABLE lots;
DROP TABLE stuff_translations;
DROP TABLE stuffs;

DROP TABLE tokens_tfa_otp;
DROP TABLE tokens_tfa_purgatory;
DROP TABLE tokens_tfa_recovery;
DROP TABLE tokens_password_reset;

DROP TABLE users_employees;
DROP TABLE users_entities;
DROP TABLE users_common;

DROP TABLE "alendo-pg-migrate";

DROP FUNCTION employees_insert_update_delete_trigger();
DROP FUNCTION entities_insert_update_delete_trigger();
DROP FUNCTION lots_before_update_trigger();

DROP TYPE USER_TYPE;
DROP TYPE LANGUAGE_CODE;
DROP TYPE OTP_TYPE;
DROP TYPE LOT_TYPE;
DROP TYPE AMOUNT_TYPE;
DROP TYPE CURRENCY;

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
