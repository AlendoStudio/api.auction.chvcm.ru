--  ____                 __                        ____    _____   __
-- /\  _`\              /\ \__                    /\  _`\ /\  __`\/\ \
-- \ \ \L\ \___     ____\ \ ,_\    __   _ __    __\ \,\L\_\ \ \/\ \ \ \
--  \ \ ,__/ __`\  /',__\\ \ \/  /'_ `\/\`'__\/'__`\/_\__ \\ \ \ \ \ \ \  __
--   \ \ \/\ \L\ \/\__, `\\ \ \_/\ \L\ \ \ \//\  __/ /\ \L\ \ \ \\'\\ \ \L\ \
--    \ \_\ \____/\/\____/ \ \__\ \____ \ \_\\ \____\\ `\____\ \___\_\ \____/
--     \/_/\/___/  \/___/   \/__/\/___L\ \/_/ \/____/ \/_____/\/__//_/\/___/
--                                 /\____/                           v11/2NF
--                                 \_/__/                Font Name: Larry 3D

----------------------------------------------------------------------------
--                                                                        --
--                               MIGRATION                                --
--                                                                        --
----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS migrations
(
  name TEXT PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO migrations (name)
VALUES ('v1');

----------------------------------------------------------------------------
--                                                                        --
--                                 TYPES                                  --
--                                                                        --
----------------------------------------------------------------------------

-- User type
CREATE TYPE USER_TYPE AS ENUM ('employee', 'entity');

-- Language code (ISO 639-1)
CREATE TYPE LANGUAGE_CODE AS ENUM (
  'aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar',
  'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bh',
  'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce',
  'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da',
  'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es',
  'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fo', 'fr',
  'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha',
  'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz',
  'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is',
  'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj',
  'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku',
  'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln',
  'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk',
  'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'na', 'nb',
  'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv',
  'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi',
  'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru',
  'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk',
  'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st',
  'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti',
  'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw',
  'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo',
  'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh', 'zu');

-- One-time password type
CREATE TYPE OTP_TYPE AS ENUM ('authenticator');

-- Lot type
CREATE TYPE LOT_TYPE AS ENUM ('purchase', 'sale');

-- Amount type
CREATE TYPE AMOUNT_TYPE AS ENUM ('kg', 'piece');

-- Currency (ISO 4217:2015)
CREATE TYPE CURRENCY AS ENUM (
  'aed', 'afn', 'all', 'amd', 'ang', 'aoa', 'ars', 'aud',
  'awg', 'azn', 'bam', 'bbd', 'bdt', 'bgn', 'bhd', 'bif',
  'bmd', 'bnd', 'bob', 'bov', 'brl', 'bsd', 'btn', 'bwp',
  'byn', 'bzd', 'cad', 'cdf', 'che', 'chf', 'chw', 'clf',
  'clp', 'cny', 'cop', 'cou', 'crc', 'cuc', 'cup', 'cve',
  'czk', 'djf', 'dkk', 'dop', 'dzd', 'egp', 'ern', 'etb',
  'eur', 'fjd', 'fkp', 'gbp', 'gel', 'ghs', 'gip', 'gmd',
  'gnf', 'gtq', 'gyd', 'hkd', 'hnl', 'hrk', 'htg', 'huf',
  'idr', 'ils', 'inr', 'iqd', 'irr', 'isk', 'jmd', 'jod',
  'jpy', 'kes', 'kgs', 'khr', 'kmf', 'kpw', 'krw', 'kwd',
  'kyd', 'kzt', 'lak', 'lbp', 'lkr', 'lrd', 'lsl', 'lyd',
  'mad', 'mdl', 'mga', 'mkd', 'mmk', 'mnt', 'mop', 'mru',
  'mur', 'mvr', 'mwk', 'mxn', 'mxv', 'myr', 'mzn', 'nad',
  'ngn', 'nio', 'nok', 'npr', 'nzd', 'omr', 'pab', 'pen',
  'pgk', 'php', 'pkr', 'pln', 'pyg', 'qar', 'ron', 'rsd',
  'rub', 'rwf', 'sar', 'sbd', 'scr', 'sdg', 'sek', 'sgd',
  'shp', 'sll', 'sos', 'srd', 'ssp', 'stn', 'svc', 'syp',
  'szl', 'thb', 'tjs', 'tmt', 'tnd', 'top', 'try', 'ttd',
  'twd', 'tzs', 'uah', 'ugx', 'usd', 'usn', 'uyi', 'uyu',
  'uyw', 'uzs', 'ves', 'vnd', 'vuv', 'wst', 'xaf', 'xag',
  'xau', 'xba', 'xbb', 'xbc', 'xbd', 'xcd', 'xdr', 'xof',
  'xpd', 'xpf', 'xpt', 'xsu', 'xts', 'xua', 'xxx', 'yer',
  'zar', 'zmw', 'zwl');

----------------------------------------------------------------------------
--                                                                        --
--                                 TABLES                                 --
--                                                                        --
----------------------------------------------------------------------------

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ USERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ --

-- Common data of employees and entities
CREATE TABLE users_common
(
  id           BIGSERIAL PRIMARY KEY,                     -- id
  name         TEXT                      NOT NULL,        -- name
  email        TEXT                      NOT NULL UNIQUE, -- email
  phone        TEXT                      NOT NULL UNIQUE, -- mobile phone
  password     TEXT,                                      -- password hash with salt
  tfa          BOOLEAN     DEFAULT FALSE NOT NULL,        -- is two-factor authentication enabled?
  language     LANGUAGE_CODE             NOT NULL,        -- preferred language
  banned       BOOLEAN     DEFAULT FALSE NOT NULL,        -- is user was banned?
  type         USER_TYPE                 NOT NULL,        -- user type
  registration TIMESTAMPTZ DEFAULT NOW() NOT NULL         -- registration date
);

-- Additional data of employees
CREATE TABLE users_employees
(
  user_id   BIGINT REFERENCES users_common (id)
    ON DELETE CASCADE ON UPDATE CASCADE PRIMARY KEY, -- user id
  admin     BOOLEAN DEFAULT FALSE NOT NULL,          -- is employee have admin rights? (admin don't have moderator rights)
  moderator BOOLEAN DEFAULT FALSE NOT NULL           -- is employee have moderator rights?
);

-- Additional data of entities
CREATE TABLE users_entities
(
  user_id  BIGINT REFERENCES users_common (id)
    ON DELETE CASCADE ON UPDATE CASCADE PRIMARY KEY, -- user id
  ceo      TEXT                  NOT NULL,           -- Chief Executive Officer
  psrn     BIGINT                NOT NULL UNIQUE,    -- PSRN (Primary State Registration Number)
  itn      BIGINT                NOT NULL UNIQUE,    -- ITN (Individual Taxpayer Number)
  verified BOOLEAN DEFAULT FALSE NOT NULL            -- is entity was verified?
);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TOKENS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ --

-- Two-factor authentication purgatory tokens
CREATE TABLE tokens_tfa_purgatory
(
  token   TEXT PRIMARY KEY,                       -- token
  user_id BIGINT REFERENCES users_common (id)
    ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, -- user id
  expires TIMESTAMPTZ                   NOT NULL  -- expiration date
);

-- Two-factor authentication one-time password tokens
CREATE TABLE tokens_tfa_otp
(
  user_id BIGINT REFERENCES users_common (id)
    ON DELETE CASCADE ON UPDATE CASCADE PRIMARY KEY, -- user id
  type    OTP_TYPE NOT NULL,                         -- token type
  token   TEXT     NOT NULL                          -- token
);

-- Two-factor authentication recovery tokens
CREATE TABLE tokens_tfa_recovery
(
  token   TEXT PRIMARY KEY,                      -- token
  user_id BIGINT REFERENCES users_common (id)
    ON DELETE CASCADE ON UPDATE CASCADE NOT NULL -- user id
);

-- Tokens for password reset
CREATE TABLE tokens_password_reset
(
  token   TEXT PRIMARY KEY,                       -- token
  user_id BIGINT REFERENCES users_common (id)
    ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, -- user id
  expires TIMESTAMPTZ                   NOT NULL  -- expiration date
);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AUCTION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ --

-- Stuffs
CREATE TABLE stuffs
(
  id          BIGSERIAL PRIMARY KEY,         -- id
  amount_type AMOUNT_TYPE          NOT NULL, -- amount type
  enabled     BOOLEAN DEFAULT TRUE NOT NULL  -- is stuff enabled?
);

-- Stuff translations
CREATE TABLE stuff_translations
(
  stuff_id    BIGINT REFERENCES stuffs (id)
    ON DELETE CASCADE ON UPDATE CASCADE, -- stuff id
  code        LANGUAGE_CODE,             -- language code
  title       TEXT            NOT NULL,  -- title
  description TEXT DEFAULT '' NOT NULL,  -- description
  PRIMARY KEY (stuff_id, code)
);

-- Lots
CREATE TABLE lots
(
  id           BIGSERIAL PRIMARY KEY,              -- id
  stuff_id     BIGINT REFERENCES stuffs (id)
    ON DELETE RESTRICT ON UPDATE CASCADE NOT NULL, -- stuff id
  type         LOT_TYPE                  NOT NULL, -- lot type
  amount       NUMERIC                   NOT NULL, -- stuff amount
  start        TIMESTAMPTZ               NOT NULL, -- start time
  finish       TIMESTAMPTZ               NOT NULL, -- end time
  buffer       INTERVAL                  NOT NULL, -- time reserve
  start_bid    NUMERIC                   NOT NULL, -- start bid
  step         NUMERIC                   NOT NULL, -- auction step
  strict       BOOLEAN                   NOT NULL, -- auto calculate winning bid?
  currency     CURRENCY                  NOT NULL, -- currency
  participants BIGINT DEFAULT 0          NOT NULL, -- participants amount
  winner_bid   NUMERIC,                            -- winnerId bid
  winner_id    BIGINT REFERENCES users_entities (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE           -- winnerId id
);

-- Lot participants
CREATE TABLE lot_participants
(
  lot_id         BIGINT REFERENCES lots (id)
    ON DELETE CASCADE ON UPDATE CASCADE,  -- lot id
  participant_id BIGINT REFERENCES users_entities (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE, -- participant id
  PRIMARY KEY (lot_id, participant_id)
);

----------------------------------------------------------------------------
--                                                                        --
--                                 VIEWS                                  --
--                                                                        --
----------------------------------------------------------------------------

-- Employees
CREATE VIEW employees AS
SELECT users_common.id,
       users_common.name,
       users_common.email,
       users_common.phone,
       users_common.password,
       users_common.tfa,
       users_common.language,
       users_common.banned,
       users_common.registration,
       users_employees.admin,
       users_employees.moderator
FROM users_common
       INNER JOIN users_employees ON users_common.id = users_employees.user_id
WHERE users_common.type = 'employee';

-- Entities
CREATE VIEW entities AS
SELECT users_common.id,
       users_common.name,
       users_common.email,
       users_common.phone,
       users_common.password,
       users_common.tfa,
       users_common.language,
       users_common.banned,
       users_common.registration,
       users_entities.ceo,
       users_entities.psrn,
       users_entities.itn,
       users_entities.verified
FROM users_common
       INNER JOIN users_entities ON users_common.id = users_entities.user_id
WHERE users_common.type = 'entity';

----------------------------------------------------------------------------
--                                                                        --
--                                INDEXES                                 --
--                                                                        --
----------------------------------------------------------------------------

CREATE INDEX btree_index_tokens_tfa_purgatory_token
  ON tokens_tfa_purgatory
    USING btree (token);

CREATE INDEX btree_index_tokens_tfa_recovery_token
  ON tokens_tfa_recovery
    USING btree (token);

CREATE INDEX btree_index_tokens_password_reset_token
  ON tokens_password_reset
    USING btree (token);

----------------------------------------------------------------------------
--                                                                        --
--                               FUNCTIONS                                --
--                                                                        --
----------------------------------------------------------------------------

-- Insert/Update/Delete realisation for Employees view
CREATE FUNCTION employees_insert_update_delete_trigger()
  RETURNS TRIGGER AS
$$
BEGIN
  IF (TG_OP = 'INSERT')
  THEN
    NEW.id = CASE
               WHEN NEW.id IS NULL
                 THEN nextval('users_common_id_seq' :: REGCLASS)
               ElSE NEW.id END;
    NEW.tfa = CASE
                WHEN NEW.tfa IS NULL
                  THEN FALSE
                ElSE NEW.tfa END;
    NEW.banned = CASE
                   WHEN NEW.banned IS NULL
                     THEN FALSE
                   ElSE NEW.banned END;
    NEW.registration = CASE
                         WHEN NEW.registration IS NULL
                           THEN NOW()
                         ElSE NEW.registration END;
    NEW.admin = CASE
                  WHEN NEW.admin IS NULL
                    THEN FALSE
                  ElSE NEW.admin END;
    NEW.moderator = CASE
                      WHEN NEW.moderator IS NULL
                        THEN FALSE
                      ElSE NEW.moderator END;
    INSERT INTO users_common (id, name, email, phone, password, tfa, language, banned, type, registration)
    VALUES (NEW.id,
            NEW.name,
            NEW.email,
            NEW.phone,
            NEW.password,
            NEW.tfa,
            NEW.language,
            NEW.banned,
            'employee',
            NEW.registration);
    INSERT INTO users_employees (user_id, admin, moderator) VALUES (NEW.id, NEW.admin, NEW.moderator);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE')
  THEN
    UPDATE users_common
    SET id           = NEW.id,
        name         = NEW.name,
        email        = NEW.email,
        phone        = NEW.phone,
        password     = NEW.password,
        tfa          = NEW.tfa,
        language     = NEW.language,
        banned       = NEW.banned,
        registration = NEW.registration
    WHERE id = OLD.id;
    UPDATE users_employees
    SET admin     = NEW.admin,
        moderator = NEW.moderator
    WHERE user_id = NEW.id;
    RETURN NEW;
  ELSE
    DELETE FROM users_common WHERE id = OLD.id;
    RETURN OLD;
  END IF;
END;
$$
  LANGUAGE plpgsql;

-- Insert/Update/Delete realisation for Entities view
CREATE FUNCTION entities_insert_update_delete_trigger()
  RETURNS TRIGGER AS
$$
BEGIN
  IF (TG_OP = 'INSERT')
  THEN
    NEW.id = CASE
               WHEN NEW.id IS NULL
                 THEN nextval('users_common_id_seq' :: REGCLASS)
               ElSE NEW.id END;
    NEW.tfa = CASE
                WHEN NEW.tfa IS NULL
                  THEN FALSE
                ElSE NEW.tfa END;
    NEW.banned = CASE
                   WHEN NEW.banned IS NULL
                     THEN FALSE
                   ElSE NEW.banned END;
    NEW.registration = CASE
                         WHEN NEW.registration IS NULL
                           THEN NOW()
                         ElSE NEW.registration END;
    NEW.verified = CASE
                     WHEN NEW.verified IS NULL
                       THEN FALSE
                     ElSE NEW.verified END;
    INSERT INTO users_common (id, name, email, phone, password, tfa, language, banned, type, registration)
    VALUES (NEW.id,
            NEW.name,
            NEW.email,
            NEW.phone,
            NEW.password,
            NEW.tfa,
            NEW.language,
            NEW.banned,
            'entity',
            NEW.registration);
    INSERT INTO users_entities (user_id, ceo, psrn, itn, verified)
    VALUES (NEW.id, NEW.ceo, NEW.psrn, NEW.itn, NEW.verified);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE')
  THEN
    UPDATE users_common
    SET id           = NEW.id,
        name         = NEW.name,
        email        = NEW.email,
        phone        = NEW.phone,
        password     = NEW.password,
        tfa          = NEW.tfa,
        language     = NEW.language,
        banned       = NEW.banned,
        registration = NEW.registration
    WHERE id = OLD.id;
    UPDATE users_entities
    SET ceo      = NEW.ceo,
        psrn     = NEW.psrn,
        itn      = NEW.itn,
        verified = NEW.verified
    WHERE user_id = NEW.id;
    RETURN NEW;
  ELSE
    DELETE FROM users_common WHERE id = OLD.id;
    RETURN OLD;
  END IF;
END;
$$
  LANGUAGE plpgsql;

-- Lot before update logic
CREATE FUNCTION lots_before_update_trigger()
  RETURNS TRIGGER AS
$$
DECLARE
  _now TIMESTAMPTZ;
BEGIN
  IF (NEW.winner_id IS NULL OR NEW.winner_bid IS NULL)
  THEN
    NEW.winner_bid = OLD.winner_bid;
    NEW.winner_id = OLD.winner_id;
    RETURN NEW;
  END IF;
  IF (NEW."strict")
  THEN
    IF (OLD.winner_bid IS NULL)
    THEN
      NEW.winner_bid = NEW.start_bid;
    ELSEIF (NEW.type = 'sale')
    THEN
      NEW.winner_bid = OLD.winner_bid + NEW.step;
    ELSEIF (NEW.type = 'purchase')
    THEN
      NEW.winner_bid = OLD.winner_bid - NEW.step;
    END IF;
  END IF;
  IF (NEW.winner_bid < 0)
  THEN
    NEW.winner_bid = 0;
  END IF;
  _now = NOW();
  INSERT INTO lot_participants (lot_id, participant_id) VALUES (NEW.id, NEW.winner_id) ON CONFLICT DO NOTHING;
  SELECT COUNT(*) FROM lot_participants WHERE lot_id = NEW.id INTO NEW.participants;
  IF (NEW.type = 'sale' AND (OLD.winner_bid IS NULL AND NEW.winner_bid < NEW.start_bid OR
                             OLD.winner_bid IS NOT NULL AND NEW.winner_bid < OLD.winner_bid + NEW.step) OR
      NEW.type = 'purchase' AND (OLD.winner_bid IS NULL AND NEW.winner_bid > NEW.start_bid OR
                                 OLD.winner_bid IS NOT NULL AND NEW.winner_bid > OLD.winner_bid - NEW.step) OR
      NEW.winner_bid = OLD.winner_bid)
  THEN
    NEW.winner_bid = OLD.winner_bid;
    NEW.winner_id = OLD.winner_id;
  ELSEIF (NEW.finish - _now < NEW.buffer)
  THEN
    NEW.finish = _now + NEW.buffer;
  END IF;
  RETURN NEW;
END;
$$
  LANGUAGE plpgsql;

----------------------------------------------------------------------------
--                                                                        --
--                                TRIGGERS                                --
--                                                                        --
----------------------------------------------------------------------------

CREATE TRIGGER employees_insert_update_delete_trigger
  INSTEAD OF INSERT OR UPDATE OR DELETE
  ON employees
  FOR EACH ROW
EXECUTE PROCEDURE employees_insert_update_delete_trigger();

CREATE TRIGGER entities_insert_update_delete_trigger
  INSTEAD OF INSERT OR UPDATE OR DELETE
  ON entities
  FOR EACH ROW
EXECUTE PROCEDURE entities_insert_update_delete_trigger();

CREATE TRIGGER lots_before_update_trigger
  BEFORE UPDATE
  ON lots
  FOR EACH ROW
EXECUTE PROCEDURE lots_before_update_trigger();

--                             _.-----.._____,-~~~~-._...__
--                          ,-'            /         `....
--                        ,'             ,'      .  .  \::.
--                      ,'        . ''    :     . \  `./::..
--                    ,'    ..   .     .      .  . : ;':::.
--                   /     :go. :       . :    \ : ;'.::.
--                   |     ' .o8)     .  :|    : ,'. .
--                  /     :   ~:'  . '   :/  . :/. .
--                 /       ,  '          |   : /. .
--                /       ,              |   ./.
--                L._    .       ,' .:.  /  ,'.
--               /-.     :.--._,-'~~~~~~| ,'|:
--              ,--.    /   .:/         |/::| `.
--              |-.    /   .;'      .-__)::/    \
-- ...._____...-|-.  ,'  .;'      .' '.'|;'      |
--   ~--..._____\-_-'  .:'      .'   /  '
--    ___....--~~   _.-' `.___.'   ./
--      ~~------+~~_. .    ~~    .,'
--                  ~:_.' . . ._:'   _ Seal _
--                     ~~-+-+~~
