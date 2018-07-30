--  ____                 __                        ____    _____   __
-- /\  _`\              /\ \__                    /\  _`\ /\  __`\/\ \
-- \ \ \L\ \___     ____\ \ ,_\    __   _ __    __\ \,\L\_\ \ \/\ \ \ \
--  \ \ ,__/ __`\  /',__\\ \ \/  /'_ `\/\`'__\/'__`\/_\__ \\ \ \ \ \ \ \  __
--   \ \ \/\ \L\ \/\__, `\\ \ \_/\ \L\ \ \ \//\  __/ /\ \L\ \ \ \\'\\ \ \L\ \
--    \ \_\ \____/\/\____/ \ \__\ \____ \ \_\\ \____\\ `\____\ \___\_\ \____/
--     \/_/\/___/  \/___/   \/__/\/___L\ \/_/ \/____/ \/_____/\/__//_/\/___/
--                                 /\____/                               v10
--                                 \_/__/                Font Name: Larry 3D

----------------------------------------------------------------------------
--                                                                        --
--                                 TYPES                                  --
--                                                                        --
----------------------------------------------------------------------------

-- User type
CREATE TYPE USER_TYPE AS ENUM ('employee', 'entity');

-- Language code (ISO 639-1)
CREATE TYPE LANGUAGE_CODE AS ENUM (
  'aa',
  'ab',
  'ae',
  'af',
  'ak',
  'am',
  'an',
  'ar',
  'as',
  'av',
  'ay',
  'az',
  'ba',
  'be',
  'bg',
  'bh',
  'bi',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'ca',
  'ce',
  'ch',
  'co',
  'cr',
  'cs',
  'cu',
  'cv',
  'cy',
  'da',
  'de',
  'dv',
  'dz',
  'ee',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fa',
  'ff',
  'fi',
  'fj',
  'fl',
  'fo',
  'fr',
  'fy',
  'ga',
  'gd',
  'gl',
  'gn',
  'gu',
  'gv',
  'ha',
  'he',
  'hi',
  'ho',
  'hr',
  'ht',
  'hu',
  'hy',
  'hz',
  'ia',
  'id',
  'ie',
  'ig',
  'ii',
  'ik',
  'io',
  'is',
  'it',
  'iu',
  'ja',
  'jv',
  'ka',
  'kg',
  'ki',
  'kj',
  'kk',
  'kl',
  'km',
  'kn',
  'ko',
  'kr',
  'ks',
  'ku',
  'kv',
  'kw',
  'ky',
  'la',
  'lb',
  'lg',
  'li',
  'ln',
  'lo',
  'lt',
  'lu',
  'lv',
  'mg',
  'mh',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'mt',
  'my',
  'na',
  'nb',
  'nd',
  'ne',
  'ng',
  'nl',
  'nn',
  'no',
  'nr',
  'nv',
  'ny',
  'oc',
  'oj',
  'om',
  'or',
  'os',
  'pa',
  'pi',
  'pl',
  'ps',
  'pt',
  'qu',
  'rm',
  'rn',
  'ro',
  'ru',
  'rw',
  'sa',
  'sc',
  'sd',
  'se',
  'sg',
  'si',
  'sk',
  'sl',
  'sm',
  'sn',
  'so',
  'sq',
  'sr',
  'ss',
  'st',
  'su',
  'sv',
  'sw',
  'ta',
  'te',
  'tg',
  'th',
  'ti',
  'tk',
  'tl',
  'tn',
  'to',
  'tr',
  'ts',
  'tt',
  'tw',
  'ty',
  'ug',
  'uk',
  'ur',
  'uz',
  've',
  'vi',
  'vo',
  'wa',
  'wo',
  'xh',
  'yi',
  'yo',
  'za',
  'zh',
  'zu'
);

-- Lot type
CREATE TYPE LOT_TYPE AS ENUM ('purchase', 'sale');

-- Lot amount type
CREATE TYPE LOT_AMOUNT_TYPE AS ENUM ('kg', 'piece');

-- Currency (ISO 4217:2015)
CREATE TYPE CURRENCY AS ENUM (
  'aed',
  'afn',
  'all',
  'amd',
  'ang',
  'aoa',
  'ars',
  'aud',
  'awg',
  'azn',
  'bam',
  'bbd',
  'bdt',
  'bgn',
  'bhd',
  'bif',
  'bmd',
  'bnd',
  'bob',
  'bov',
  'brl',
  'bsd',
  'btn',
  'bwp',
  'byn',
  'bzd',
  'cad',
  'cdf',
  'che',
  'chf',
  'chw',
  'clf',
  'clp',
  'cny',
  'cop',
  'cou',
  'crc',
  'cuc',
  'cup',
  'cve',
  'czk',
  'djf',
  'dkk',
  'dop',
  'dzd',
  'egp',
  'ern',
  'etb',
  'eur',
  'fjd',
  'fkp',
  'gbp',
  'gel',
  'ghs',
  'gip',
  'gmd',
  'gnf',
  'gtq',
  'gyd',
  'hkd',
  'hnl',
  'hrk',
  'htg',
  'huf',
  'idr',
  'ils',
  'inr',
  'iqd',
  'irr',
  'isk',
  'jmd',
  'jod',
  'jpy',
  'kes',
  'kgs',
  'khr',
  'kmf',
  'kpw',
  'krw',
  'kwd',
  'kyd',
  'kzt',
  'lak',
  'lbp',
  'lkr',
  'lrd',
  'lsl',
  'lyd',
  'mad',
  'mdl',
  'mga',
  'mkd',
  'mmk',
  'mnt',
  'mop',
  'mru',
  'mur',
  'mvr',
  'mwk',
  'mxn',
  'mxv',
  'myr',
  'mzn',
  'nad',
  'ngn',
  'nio',
  'nok',
  'npr',
  'nzd',
  'omr',
  'pab',
  'pen',
  'pgk',
  'php',
  'pkr',
  'pln',
  'pyg',
  'qar',
  'ron',
  'rsd',
  'rub',
  'rwf',
  'sar',
  'sbd',
  'scr',
  'sdg',
  'sek',
  'sgd',
  'shp',
  'sll',
  'sos',
  'srd',
  'ssp',
  'stn',
  'svc',
  'syp',
  'szl',
  'thb',
  'tjs',
  'tmt',
  'tnd',
  'top',
  'try',
  'ttd',
  'twd',
  'tzs',
  'uah',
  'ugx',
  'usd',
  'usn',
  'uyi',
  'uyu',
  'uzs',
  'vef',
  'vnd',
  'vuv',
  'wst',
  'xaf',
  'xag',
  'xau',
  'xba',
  'xbb',
  'xbc',
  'xbd',
  'xcd',
  'xdr',
  'xof',
  'xpd',
  'xpf',
  'xpt',
  'xsu',
  'xts',
  'xua',
  'xxx',
  'yer',
  'zar',
  'zmw',
  'zwl'
);

----------------------------------------------------------------------------
--                                                                        --
--                                 TABLES                                 --
--                                                                        --
----------------------------------------------------------------------------

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ USERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ --

-- Common data of employees and entities
CREATE TABLE users_common (
  id            BIGSERIAL PRIMARY KEY, -- id
  name          TEXT                     NOT NULL, -- name
  email         TEXT                     NOT NULL UNIQUE, -- email
  phone         TEXT                     NOT NULL UNIQUE, -- mobile phone
  password      TEXT, -- password hash with salt
  authenticator TEXT, -- Google Authenticator secret
  tfa           BOOLEAN                  NOT NULL, -- is two-factor authentication enabled?
  language      LANGUAGE_CODE            NOT NULL, -- preferred language
  banned        BOOLEAN                  NOT NULL, -- is user was banned?
  type          USER_TYPE                NOT NULL, -- user type
  registration  TIMESTAMP WITH TIME ZONE NOT NULL -- registration date
);

-- Additional data of employees
CREATE TABLE users_employees (
  userid    BIGINT REFERENCES users_common (id)
  ON DELETE RESTRICT ON UPDATE CASCADE PRIMARY KEY, -- user id
  admin     BOOLEAN NOT NULL, -- is employee have admin rights?
  moderator BOOLEAN NOT NULL -- is employee have moderator rights?
);

-- Additional data of entities
CREATE TABLE users_entities (
  userid   BIGINT REFERENCES users_common (id)
  ON DELETE RESTRICT ON UPDATE CASCADE PRIMARY KEY, -- user id
  ceo      TEXT    NOT NULL, -- Chief Executive Officer
  psrn     BIGINT  NOT NULL UNIQUE, -- PSRN (Primary State Registration Number)
  itn      BIGINT  NOT NULL UNIQUE, -- ITN (Individual Taxpayer Number)
  verified BOOLEAN NOT NULL -- is entity was verified?
);

-- Attachments
CREATE TABLE attachments (
  userid BIGINT REFERENCES users_entities (userid)
  ON DELETE RESTRICT ON UPDATE CASCADE PRIMARY KEY, -- entity id
  url    TEXT NOT NULL
);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TOKENS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ --

-- Two-factor authentication purgatory
CREATE TABLE tokens_tfa_purgatory (
  token   TEXT PRIMARY KEY, -- token
  userid  BIGINT REFERENCES users_common (id)
  ON DELETE RESTRICT ON UPDATE CASCADE NOT NULL, -- user id
  expires TIMESTAMP WITH TIME ZONE     NOT NULL -- expires date
);

-- Two-factor authentication (via email) tokens
CREATE TABLE tokens_tfa_email (
  token     TEXT PRIMARY KEY, -- token
  purgatory TEXT REFERENCES tokens_tfa_purgatory (token)
  ON DELETE CASCADE ON UPDATE CASCADE NOT NULL -- purgatory token
);

-- Two-factor authentication recovery tokens
CREATE TABLE tokens_tfa_recovery (
  token  TEXT PRIMARY KEY, -- token
  userid BIGINT REFERENCES users_common (id)
  ON DELETE RESTRICT ON UPDATE CASCADE NOT NULL -- user id
);

-- Tokens for password reset
CREATE TABLE tokens_password_reset (
  token   TEXT PRIMARY KEY, -- token
  userid  BIGINT REFERENCES users_common (id)
  ON DELETE RESTRICT ON UPDATE CASCADE NOT NULL, -- user id
  expires TIMESTAMP WITH TIME ZONE     NOT NULL -- expires date
);

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AUCTION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ --

-- Auction stuffs
CREATE TABLE stuffs (
  id      BIGSERIAL PRIMARY KEY, -- id
  enabled BOOLEAN NOT NULL DEFAULT TRUE -- is stuff enabled?
);

-- Auction stuff translations
CREATE TABLE stuff_translations (
  stuffid     BIGINT REFERENCES stuffs (id)
  ON DELETE RESTRICT ON UPDATE CASCADE, -- stuff id
  code        LANGUAGE_CODE, -- language code
  translation JSONB NOT NULL, -- translation
  PRIMARY KEY (code, stuffid)
);

-- Auction lots
CREATE TABLE lots (
  id           BIGSERIAL PRIMARY KEY, -- id
  stuffid      BIGINT REFERENCES stuffs (id)
  ON DELETE RESTRICT ON UPDATE CASCADE                 NOT NULL, -- stuff id
  type         LOT_TYPE                                NOT NULL, -- lot type
  amount       NUMERIC                                 NOT NULL, -- amount
  amount_type  LOT_AMOUNT_TYPE                         NOT NULL, -- amount type
  start        TIMESTAMP WITH TIME ZONE                NOT NULL, -- start time
  finish       TIMESTAMP WITH TIME ZONE                NOT NULL, -- end time
  buffer       INTERVAL                                NOT NULL, -- buffer interval
  startbid     NUMERIC                                 NOT NULL, -- start bid
  step         NUMERIC                                 NOT NULL, -- auction step
  currency     CURRENCY                                NOT NULL, -- currency
  participants BIGINT                                  NOT NULL DEFAULT 0, -- participants amount
  winbid       NUMERIC, -- winning bid
  winner       BIGINT REFERENCES users_entities (userid)
  ON DELETE RESTRICT ON UPDATE CASCADE -- winner entity id
);

-- Lot participants
CREATE TABLE lot_participants (
  lotid  BIGINT REFERENCES lots (id)
  ON DELETE RESTRICT ON UPDATE CASCADE, -- lot id
  userid BIGINT REFERENCES users_entities (userid)
  ON DELETE RESTRICT ON UPDATE CASCADE, -- entity id
  PRIMARY KEY (lotid, userid)
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
         users_common.authenticator,
         users_common.tfa,
         users_common.language,
         users_common.banned,
         users_common.registration,
         users_employees.admin,
         users_employees.moderator
  FROM users_common,
       users_employees
  WHERE users_common.id = users_employees.userid;

-- Entities
CREATE VIEW entities AS
  SELECT users_common.id,
         users_common.name,
         users_common.email,
         users_common.phone,
         users_common.password,
         users_common.authenticator,
         users_common.tfa,
         users_common.language,
         users_common.banned,
         users_common.registration,
         users_entities.ceo,
         users_entities.psrn,
         users_entities.itn,
         users_entities.verified
  FROM users_common,
       users_entities
  WHERE users_common.id = users_entities.userid;

----------------------------------------------------------------------------
--                                                                        --
--                                INDEXES                                 --
--                                                                        --
----------------------------------------------------------------------------

CREATE INDEX btree_index_tokens_tfa_purgatory_token
  ON tokens_tfa_purgatory
  USING btree (token);

CREATE INDEX btree_index_tokens_tfa_email_token
  ON tokens_tfa_email
  USING btree (token);

CREATE INDEX btree_index_tokens_tfa_recovery_token
  ON tokens_tfa_recovery
  USING btree (token);

CREATE INDEX btree_index_tokens_password_reset_token
  ON tokens_password_reset
  USING btree (token);

CREATE INDEX gin_index_stuff_translations_translation
  ON stuff_translations
  USING gin (translation);

----------------------------------------------------------------------------
--                                                                        --
--                               FUNCTIONS                                --
--                                                                        --
----------------------------------------------------------------------------

-- Insert/Update/Delete realisation for Employees view
CREATE FUNCTION employees_insert_update_delete_trigger()
  RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT'
  THEN
    INSERT INTO users_common (id,
                              name,
                              email,
                              phone,
                              password,
                              authenticator,
                              tfa,
                              language,
                              banned,
                              type,
                              registration)
    VALUES (CASE
              WHEN NEW.id IS NULL
                      THEN nextval('users_common_id_seq' :: REGCLASS)
              ELSE NEW.ID END,
            NEW.name,
            NEW.email,
            NEW.phone,
            NEW.password,
            NEW.authenticator,
            CASE
              WHEN NEW.tfa IS NULL
                      THEN FALSE
              ELSE NEW.tfa END,
            NEW.language,
            CASE
              WHEN NEW.banned IS NULL
                      THEN FALSE
              ELSE NEW.banned END,
            'employee',
            CASE
              WHEN NEW.registration IS NULL
                      THEN NOW()
              ELSE NEW.registration END)
      RETURNING id, tfa, registration
        INTO NEW.id, NEW.tfa, NEW.registration;
    INSERT INTO users_employees (userid, admin, moderator)
    VALUES (NEW.id,
            CASE
              WHEN NEW.admin IS NULL
                      THEN FALSE
              ELSE NEW.admin END,
            CASE
              WHEN NEW.moderator IS NULL
                      THEN FALSE
              ELSE NEW.moderator END)
      RETURNING admin, moderator
        INTO NEW.admin, NEW.moderator;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE'
    THEN
      UPDATE users_common
      SET id            = NEW.id,
          name          = NEW.name,
          email         = NEW.email,
          phone         = NEW.phone,
          password      = NEW.password,
          authenticator = NEW.authenticator,
          tfa           = NEW.tfa,
          language      = NEW.language,
          banned        = NEW.banned,
          registration  = NEW.registration
      WHERE id = OLD.id;
      UPDATE users_employees
      SET userid    = NEW.id,
          admin     = NEW.admin,
          moderator = NEW.moderator
      WHERE userid = NEW.id;
      RETURN NEW;
  ELSE
    DELETE FROM users_employees WHERE userid = OLD.id;
    DELETE FROM users_common WHERE id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Insert/Update/Delete realisation for Entity view
CREATE FUNCTION entities_insert_update_delete_trigger()
  RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT'
  THEN
    INSERT INTO users_common (id,
                              name,
                              email,
                              phone,
                              password,
                              authenticator,
                              tfa,
                              language,
                              banned,
                              type,
                              registration)
    VALUES (CASE
              WHEN NEW.id IS NULL
                      THEN nextval('users_common_id_seq' :: REGCLASS)
              ELSE NEW.ID END,
            NEW.name,
            NEW.email,
            NEW.phone,
            NEW.password,
            NEW.authenticator,
            CASE
              WHEN NEW.tfa IS NULL
                      THEN FALSE
              ELSE NEW.tfa END,
            NEW.language,
            CASE
              WHEN NEW.banned IS NULL
                      THEN FALSE
              ELSE NEW.banned END,
            'employee',
            CASE
              WHEN NEW.registration IS NULL
                      THEN NOW()
              ELSE NEW.registration END)
      RETURNING id, tfa, registration
        INTO NEW.id, NEW.tfa, NEW.registration;
    INSERT INTO users_entities (userid, ceo, psrn, itn, verified)
    VALUES (NEW.id,
            NEW.ceo,
            NEW.psrn,
            NEW.itn,
            CASE
              WHEN NEW.verified IS NULL
                      THEN FALSE
              ELSE NEW.verified END)
      RETURNING verified
        INTO NEW.verified;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE'
    THEN
      UPDATE users_common
      SET id            = NEW.id,
          name          = NEW.name,
          email         = NEW.email,
          phone         = NEW.phone,
          password      = NEW.password,
          authenticator = NEW.authenticator,
          tfa           = NEW.tfa,
          language      = NEW.language,
          banned        = NEW.banned,
          registration  = NEW.registration
      WHERE id = OLD.id;
      UPDATE users_entities
      SET userid   = NEW.id,
          ceo      = NEW.ceo,
          psrn     = NEW.psrn,
          itn      = NEW.itn,
          verified = NEW.verified
      WHERE userid = NEW.id;
      RETURN NEW;
  ELSE
    DELETE FROM users_entities WHERE userid = OLD.id;
    DELETE FROM users_common WHERE id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- ABS for intervals
-- https://stackoverflow.com/a/44787918
CREATE FUNCTION abs_interval(INTERVAL)
  RETURNS INTERVAL AS
$$ SELECT CASE
            WHEN ($1 < INTERVAL '0')
                    THEN -$1
            ELSE $1 END; $$
LANGUAGE SQL
IMMUTABLE;

-- Lot update logic
CREATE FUNCTION lots_update_trigger()
  RETURNS TRIGGER AS $$
DECLARE
  _now    TIMESTAMP WITH TIME ZONE;
  _buffer INTERVAL;
BEGIN
  IF (NEW.winner IS NULL OR NEW.winbid IS NULL)
  THEN
    RETURN NEW;
  END IF;
  _now = NOW();
  _buffer = abs_interval(NEW.buffer);
  INSERT INTO lot_participants (lotid, userid) VALUES (NEW.id, NEW.winner) ON CONFLICT (lotid, userid)
                                                                                       DO NOTHING;
  SELECT count(*) FROM lot_participants WHERE lotid = NEW.id
    INTO NEW.participants;
  IF (NEW.type = 'sale' AND (OLD.winbid IS NULL AND NEW.winbid < NEW.startbid OR
                             OLD.winbid IS NOT NULL AND NEW.winbid < OLD.winbid + NEW.step) OR
      NEW.type = 'purchase' AND (OLD.winbid IS NULL AND NEW.winbid > NEW.startbid OR
                                 OLD.winbid IS NOT NULL AND NEW.winbid > OLD.winbid - NEW.step))
  THEN
    NEW.winbid = OLD.winbid;
    NEW.winner = OLD.winner;
  ELSEIF (NEW.finish - _now < _buffer)
    THEN
      NEW.finish = NEW.finish + _buffer - (NEW.finish - _now);
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
  FOR EACH ROW EXECUTE PROCEDURE employees_insert_update_delete_trigger();

CREATE TRIGGER entities_insert_update_delete_trigger
  INSTEAD OF INSERT OR UPDATE OR DELETE
  ON entities
  FOR EACH ROW EXECUTE PROCEDURE entities_insert_update_delete_trigger();

CREATE TRIGGER lots_update_trigger
  BEFORE UPDATE
  ON lots
  FOR EACH ROW EXECUTE PROCEDURE lots_update_trigger();

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
