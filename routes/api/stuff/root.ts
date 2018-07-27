import {
  BooleanUnit,
  NotEmptyStringUnit,
  ObjectUnit,
  PgBigSerialUnit,
  PgEnumUnit,
  PgEnumUnitCacheMemory,
  PgEnumUnitClient,
  RequestValidator,
} from "@alendo/express-req-validator";

import {Router} from "express";

import {
  Auth,
  IStuffInstance,
  Sequelize,
} from "src";

const router = Router();
export default router;

router.use(Auth.requireModerator);

/**
 * @api {post} /stuff Создать новый материал
 * @apiVersion 0.0.0
 * @apiName Create
 * @apiGroup Stuff
 * @apiPermission Модератор
 *
 * @apiSuccess {string="1..9223372036854775807"} id ID материала
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 * @apiUse v000AuthRequireModerator
 */
router.post("/", async (req, res) => {
  let result: IStuffInstance;
  await res.achain
    .action(async () => {
      result = await Sequelize.instance.stuff.create({
        enabled: true,
      }, {
        returning: true,
      });
    })
    .json(() => {
      return {
        id: result.id,
      };
    })
    .execute();
});

/**
 * @api {post} /stuff/:id Изменить материал
 * @apiVersion 0.0.0
 * @apiName Update
 * @apiGroup Stuff
 * @apiPermission Модератор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID материала
 * @apiParam {boolean} [enabled] Включен ли материал?
 * @apiParam {object} [tr] Переводы
 * @apiParam {string} [tr.aa] Перевод на язык под кодом "aa" согласно ISO 639-1
 * @apiParam {string} [tr.ab] Перевод на язык под кодом "ab" согласно ISO 639-1
 * @apiParam {string} [tr.ae] Перевод на язык под кодом "ae" согласно ISO 639-1
 * @apiParam {string} [tr.af] Перевод на язык под кодом "af" согласно ISO 639-1
 * @apiParam {string} [tr.ak] Перевод на язык под кодом "ak" согласно ISO 639-1
 * @apiParam {string} [tr.am] Перевод на язык под кодом "am" согласно ISO 639-1
 * @apiParam {string} [tr.an] Перевод на язык под кодом "an" согласно ISO 639-1
 * @apiParam {string} [tr.ar] Перевод на язык под кодом "ar" согласно ISO 639-1
 * @apiParam {string} [tr.as] Перевод на язык под кодом "as" согласно ISO 639-1
 * @apiParam {string} [tr.av] Перевод на язык под кодом "av" согласно ISO 639-1
 * @apiParam {string} [tr.ay] Перевод на язык под кодом "ay" согласно ISO 639-1
 * @apiParam {string} [tr.az] Перевод на язык под кодом "az" согласно ISO 639-1
 * @apiParam {string} [tr.ba] Перевод на язык под кодом "ba" согласно ISO 639-1
 * @apiParam {string} [tr.be] Перевод на язык под кодом "be" согласно ISO 639-1
 * @apiParam {string} [tr.bg] Перевод на язык под кодом "bg" согласно ISO 639-1
 * @apiParam {string} [tr.bh] Перевод на язык под кодом "bh" согласно ISO 639-1
 * @apiParam {string} [tr.bi] Перевод на язык под кодом "bi" согласно ISO 639-1
 * @apiParam {string} [tr.bm] Перевод на язык под кодом "bm" согласно ISO 639-1
 * @apiParam {string} [tr.bn] Перевод на язык под кодом "bn" согласно ISO 639-1
 * @apiParam {string} [tr.bo] Перевод на язык под кодом "bo" согласно ISO 639-1
 * @apiParam {string} [tr.br] Перевод на язык под кодом "br" согласно ISO 639-1
 * @apiParam {string} [tr.bs] Перевод на язык под кодом "bs" согласно ISO 639-1
 * @apiParam {string} [tr.ca] Перевод на язык под кодом "ca" согласно ISO 639-1
 * @apiParam {string} [tr.ce] Перевод на язык под кодом "ce" согласно ISO 639-1
 * @apiParam {string} [tr.ch] Перевод на язык под кодом "ch" согласно ISO 639-1
 * @apiParam {string} [tr.co] Перевод на язык под кодом "co" согласно ISO 639-1
 * @apiParam {string} [tr.cr] Перевод на язык под кодом "cr" согласно ISO 639-1
 * @apiParam {string} [tr.cs] Перевод на язык под кодом "cs" согласно ISO 639-1
 * @apiParam {string} [tr.cu] Перевод на язык под кодом "cu" согласно ISO 639-1
 * @apiParam {string} [tr.cv] Перевод на язык под кодом "cv" согласно ISO 639-1
 * @apiParam {string} [tr.cy] Перевод на язык под кодом "cy" согласно ISO 639-1
 * @apiParam {string} [tr.da] Перевод на язык под кодом "da" согласно ISO 639-1
 * @apiParam {string} [tr.de] Перевод на язык под кодом "de" согласно ISO 639-1
 * @apiParam {string} [tr.dv] Перевод на язык под кодом "dv" согласно ISO 639-1
 * @apiParam {string} [tr.dz] Перевод на язык под кодом "dz" согласно ISO 639-1
 * @apiParam {string} [tr.ee] Перевод на язык под кодом "ee" согласно ISO 639-1
 * @apiParam {string} [tr.el] Перевод на язык под кодом "el" согласно ISO 639-1
 * @apiParam {string} [tr.en] Перевод на язык под кодом "en" согласно ISO 639-1
 * @apiParam {string} [tr.eo] Перевод на язык под кодом "eo" согласно ISO 639-1
 * @apiParam {string} [tr.es] Перевод на язык под кодом "es" согласно ISO 639-1
 * @apiParam {string} [tr.et] Перевод на язык под кодом "et" согласно ISO 639-1
 * @apiParam {string} [tr.eu] Перевод на язык под кодом "eu" согласно ISO 639-1
 * @apiParam {string} [tr.fa] Перевод на язык под кодом "fa" согласно ISO 639-1
 * @apiParam {string} [tr.ff] Перевод на язык под кодом "ff" согласно ISO 639-1
 * @apiParam {string} [tr.fi] Перевод на язык под кодом "fi" согласно ISO 639-1
 * @apiParam {string} [tr.fj] Перевод на язык под кодом "fj" согласно ISO 639-1
 * @apiParam {string} [tr.fl] Перевод на язык под кодом "fl" согласно ISO 639-1
 * @apiParam {string} [tr.fo] Перевод на язык под кодом "fo" согласно ISO 639-1
 * @apiParam {string} [tr.fr] Перевод на язык под кодом "fr" согласно ISO 639-1
 * @apiParam {string} [tr.fy] Перевод на язык под кодом "fy" согласно ISO 639-1
 * @apiParam {string} [tr.ga] Перевод на язык под кодом "ga" согласно ISO 639-1
 * @apiParam {string} [tr.gd] Перевод на язык под кодом "gd" согласно ISO 639-1
 * @apiParam {string} [tr.gl] Перевод на язык под кодом "gl" согласно ISO 639-1
 * @apiParam {string} [tr.gn] Перевод на язык под кодом "gn" согласно ISO 639-1
 * @apiParam {string} [tr.gu] Перевод на язык под кодом "gu" согласно ISO 639-1
 * @apiParam {string} [tr.gv] Перевод на язык под кодом "gv" согласно ISO 639-1
 * @apiParam {string} [tr.ha] Перевод на язык под кодом "ha" согласно ISO 639-1
 * @apiParam {string} [tr.he] Перевод на язык под кодом "he" согласно ISO 639-1
 * @apiParam {string} [tr.hi] Перевод на язык под кодом "hi" согласно ISO 639-1
 * @apiParam {string} [tr.ho] Перевод на язык под кодом "ho" согласно ISO 639-1
 * @apiParam {string} [tr.hr] Перевод на язык под кодом "hr" согласно ISO 639-1
 * @apiParam {string} [tr.ht] Перевод на язык под кодом "ht" согласно ISO 639-1
 * @apiParam {string} [tr.hu] Перевод на язык под кодом "hu" согласно ISO 639-1
 * @apiParam {string} [tr.hy] Перевод на язык под кодом "hy" согласно ISO 639-1
 * @apiParam {string} [tr.hz] Перевод на язык под кодом "hz" согласно ISO 639-1
 * @apiParam {string} [tr.ia] Перевод на язык под кодом "ia" согласно ISO 639-1
 * @apiParam {string} [tr.id] Перевод на язык под кодом "id" согласно ISO 639-1
 * @apiParam {string} [tr.ie] Перевод на язык под кодом "ie" согласно ISO 639-1
 * @apiParam {string} [tr.ig] Перевод на язык под кодом "ig" согласно ISO 639-1
 * @apiParam {string} [tr.ii] Перевод на язык под кодом "ii" согласно ISO 639-1
 * @apiParam {string} [tr.ik] Перевод на язык под кодом "ik" согласно ISO 639-1
 * @apiParam {string} [tr.io] Перевод на язык под кодом "io" согласно ISO 639-1
 * @apiParam {string} [tr.is] Перевод на язык под кодом "is" согласно ISO 639-1
 * @apiParam {string} [tr.it] Перевод на язык под кодом "it" согласно ISO 639-1
 * @apiParam {string} [tr.iu] Перевод на язык под кодом "iu" согласно ISO 639-1
 * @apiParam {string} [tr.ja] Перевод на язык под кодом "ja" согласно ISO 639-1
 * @apiParam {string} [tr.jv] Перевод на язык под кодом "jv" согласно ISO 639-1
 * @apiParam {string} [tr.ka] Перевод на язык под кодом "ka" согласно ISO 639-1
 * @apiParam {string} [tr.kg] Перевод на язык под кодом "kg" согласно ISO 639-1
 * @apiParam {string} [tr.ki] Перевод на язык под кодом "ki" согласно ISO 639-1
 * @apiParam {string} [tr.kj] Перевод на язык под кодом "kj" согласно ISO 639-1
 * @apiParam {string} [tr.kk] Перевод на язык под кодом "kk" согласно ISO 639-1
 * @apiParam {string} [tr.kl] Перевод на язык под кодом "kl" согласно ISO 639-1
 * @apiParam {string} [tr.km] Перевод на язык под кодом "km" согласно ISO 639-1
 * @apiParam {string} [tr.kn] Перевод на язык под кодом "kn" согласно ISO 639-1
 * @apiParam {string} [tr.ko] Перевод на язык под кодом "ko" согласно ISO 639-1
 * @apiParam {string} [tr.kr] Перевод на язык под кодом "kr" согласно ISO 639-1
 * @apiParam {string} [tr.ks] Перевод на язык под кодом "ks" согласно ISO 639-1
 * @apiParam {string} [tr.ku] Перевод на язык под кодом "ku" согласно ISO 639-1
 * @apiParam {string} [tr.kv] Перевод на язык под кодом "kv" согласно ISO 639-1
 * @apiParam {string} [tr.kw] Перевод на язык под кодом "kw" согласно ISO 639-1
 * @apiParam {string} [tr.ky] Перевод на язык под кодом "ky" согласно ISO 639-1
 * @apiParam {string} [tr.la] Перевод на язык под кодом "la" согласно ISO 639-1
 * @apiParam {string} [tr.lb] Перевод на язык под кодом "lb" согласно ISO 639-1
 * @apiParam {string} [tr.lg] Перевод на язык под кодом "lg" согласно ISO 639-1
 * @apiParam {string} [tr.li] Перевод на язык под кодом "li" согласно ISO 639-1
 * @apiParam {string} [tr.ln] Перевод на язык под кодом "ln" согласно ISO 639-1
 * @apiParam {string} [tr.lo] Перевод на язык под кодом "lo" согласно ISO 639-1
 * @apiParam {string} [tr.lt] Перевод на язык под кодом "lt" согласно ISO 639-1
 * @apiParam {string} [tr.lu] Перевод на язык под кодом "lu" согласно ISO 639-1
 * @apiParam {string} [tr.lv] Перевод на язык под кодом "lv" согласно ISO 639-1
 * @apiParam {string} [tr.mg] Перевод на язык под кодом "mg" согласно ISO 639-1
 * @apiParam {string} [tr.mh] Перевод на язык под кодом "mh" согласно ISO 639-1
 * @apiParam {string} [tr.mi] Перевод на язык под кодом "mi" согласно ISO 639-1
 * @apiParam {string} [tr.mk] Перевод на язык под кодом "mk" согласно ISO 639-1
 * @apiParam {string} [tr.ml] Перевод на язык под кодом "ml" согласно ISO 639-1
 * @apiParam {string} [tr.mn] Перевод на язык под кодом "mn" согласно ISO 639-1
 * @apiParam {string} [tr.mr] Перевод на язык под кодом "mr" согласно ISO 639-1
 * @apiParam {string} [tr.ms] Перевод на язык под кодом "ms" согласно ISO 639-1
 * @apiParam {string} [tr.mt] Перевод на язык под кодом "mt" согласно ISO 639-1
 * @apiParam {string} [tr.my] Перевод на язык под кодом "my" согласно ISO 639-1
 * @apiParam {string} [tr.na] Перевод на язык под кодом "na" согласно ISO 639-1
 * @apiParam {string} [tr.nb] Перевод на язык под кодом "nb" согласно ISO 639-1
 * @apiParam {string} [tr.nd] Перевод на язык под кодом "nd" согласно ISO 639-1
 * @apiParam {string} [tr.ne] Перевод на язык под кодом "ne" согласно ISO 639-1
 * @apiParam {string} [tr.ng] Перевод на язык под кодом "ng" согласно ISO 639-1
 * @apiParam {string} [tr.nl] Перевод на язык под кодом "nl" согласно ISO 639-1
 * @apiParam {string} [tr.nn] Перевод на язык под кодом "nn" согласно ISO 639-1
 * @apiParam {string} [tr.no] Перевод на язык под кодом "no" согласно ISO 639-1
 * @apiParam {string} [tr.nr] Перевод на язык под кодом "nr" согласно ISO 639-1
 * @apiParam {string} [tr.nv] Перевод на язык под кодом "nv" согласно ISO 639-1
 * @apiParam {string} [tr.ny] Перевод на язык под кодом "ny" согласно ISO 639-1
 * @apiParam {string} [tr.oc] Перевод на язык под кодом "oc" согласно ISO 639-1
 * @apiParam {string} [tr.oj] Перевод на язык под кодом "oj" согласно ISO 639-1
 * @apiParam {string} [tr.om] Перевод на язык под кодом "om" согласно ISO 639-1
 * @apiParam {string} [tr.or] Перевод на язык под кодом "or" согласно ISO 639-1
 * @apiParam {string} [tr.os] Перевод на язык под кодом "os" согласно ISO 639-1
 * @apiParam {string} [tr.pa] Перевод на язык под кодом "pa" согласно ISO 639-1
 * @apiParam {string} [tr.pi] Перевод на язык под кодом "pi" согласно ISO 639-1
 * @apiParam {string} [tr.pl] Перевод на язык под кодом "pl" согласно ISO 639-1
 * @apiParam {string} [tr.ps] Перевод на язык под кодом "ps" согласно ISO 639-1
 * @apiParam {string} [tr.pt] Перевод на язык под кодом "pt" согласно ISO 639-1
 * @apiParam {string} [tr.qu] Перевод на язык под кодом "qu" согласно ISO 639-1
 * @apiParam {string} [tr.rm] Перевод на язык под кодом "rm" согласно ISO 639-1
 * @apiParam {string} [tr.rn] Перевод на язык под кодом "rn" согласно ISO 639-1
 * @apiParam {string} [tr.ro] Перевод на язык под кодом "ro" согласно ISO 639-1
 * @apiParam {string} [tr.ru] Перевод на язык под кодом "ru" согласно ISO 639-1
 * @apiParam {string} [tr.rw] Перевод на язык под кодом "rw" согласно ISO 639-1
 * @apiParam {string} [tr.sa] Перевод на язык под кодом "sa" согласно ISO 639-1
 * @apiParam {string} [tr.sc] Перевод на язык под кодом "sc" согласно ISO 639-1
 * @apiParam {string} [tr.sd] Перевод на язык под кодом "sd" согласно ISO 639-1
 * @apiParam {string} [tr.se] Перевод на язык под кодом "se" согласно ISO 639-1
 * @apiParam {string} [tr.sg] Перевод на язык под кодом "sg" согласно ISO 639-1
 * @apiParam {string} [tr.si] Перевод на язык под кодом "si" согласно ISO 639-1
 * @apiParam {string} [tr.sk] Перевод на язык под кодом "sk" согласно ISO 639-1
 * @apiParam {string} [tr.sl] Перевод на язык под кодом "sl" согласно ISO 639-1
 * @apiParam {string} [tr.sm] Перевод на язык под кодом "sm" согласно ISO 639-1
 * @apiParam {string} [tr.sn] Перевод на язык под кодом "sn" согласно ISO 639-1
 * @apiParam {string} [tr.so] Перевод на язык под кодом "so" согласно ISO 639-1
 * @apiParam {string} [tr.sq] Перевод на язык под кодом "sq" согласно ISO 639-1
 * @apiParam {string} [tr.sr] Перевод на язык под кодом "sr" согласно ISO 639-1
 * @apiParam {string} [tr.ss] Перевод на язык под кодом "ss" согласно ISO 639-1
 * @apiParam {string} [tr.st] Перевод на язык под кодом "st" согласно ISO 639-1
 * @apiParam {string} [tr.su] Перевод на язык под кодом "su" согласно ISO 639-1
 * @apiParam {string} [tr.sv] Перевод на язык под кодом "sv" согласно ISO 639-1
 * @apiParam {string} [tr.sw] Перевод на язык под кодом "sw" согласно ISO 639-1
 * @apiParam {string} [tr.ta] Перевод на язык под кодом "ta" согласно ISO 639-1
 * @apiParam {string} [tr.te] Перевод на язык под кодом "te" согласно ISO 639-1
 * @apiParam {string} [tr.tg] Перевод на язык под кодом "tg" согласно ISO 639-1
 * @apiParam {string} [tr.th] Перевод на язык под кодом "th" согласно ISO 639-1
 * @apiParam {string} [tr.ti] Перевод на язык под кодом "ti" согласно ISO 639-1
 * @apiParam {string} [tr.tk] Перевод на язык под кодом "tk" согласно ISO 639-1
 * @apiParam {string} [tr.tl] Перевод на язык под кодом "tl" согласно ISO 639-1
 * @apiParam {string} [tr.tn] Перевод на язык под кодом "tn" согласно ISO 639-1
 * @apiParam {string} [tr.to] Перевод на язык под кодом "to" согласно ISO 639-1
 * @apiParam {string} [tr.tr] Перевод на язык под кодом "tr" согласно ISO 639-1
 * @apiParam {string} [tr.ts] Перевод на язык под кодом "ts" согласно ISO 639-1
 * @apiParam {string} [tr.tt] Перевод на язык под кодом "tt" согласно ISO 639-1
 * @apiParam {string} [tr.tw] Перевод на язык под кодом "tw" согласно ISO 639-1
 * @apiParam {string} [tr.ty] Перевод на язык под кодом "ty" согласно ISO 639-1
 * @apiParam {string} [tr.ug] Перевод на язык под кодом "ug" согласно ISO 639-1
 * @apiParam {string} [tr.uk] Перевод на язык под кодом "uk" согласно ISO 639-1
 * @apiParam {string} [tr.ur] Перевод на язык под кодом "ur" согласно ISO 639-1
 * @apiParam {string} [tr.uz] Перевод на язык под кодом "uz" согласно ISO 639-1
 * @apiParam {string} [tr.ve] Перевод на язык под кодом "ve" согласно ISO 639-1
 * @apiParam {string} [tr.vi] Перевод на язык под кодом "vi" согласно ISO 639-1
 * @apiParam {string} [tr.vo] Перевод на язык под кодом "vo" согласно ISO 639-1
 * @apiParam {string} [tr.wa] Перевод на язык под кодом "wa" согласно ISO 639-1
 * @apiParam {string} [tr.wo] Перевод на язык под кодом "wo" согласно ISO 639-1
 * @apiParam {string} [tr.xh] Перевод на язык под кодом "xh" согласно ISO 639-1
 * @apiParam {string} [tr.yi] Перевод на язык под кодом "yi" согласно ISO 639-1
 * @apiParam {string} [tr.yo] Перевод на язык под кодом "yo" согласно ISO 639-1
 * @apiParam {string} [tr.za] Перевод на язык под кодом "za" согласно ISO 639-1
 * @apiParam {string} [tr.zh] Перевод на язык под кодом "zh" согласно ISO 639-1
 * @apiParam {string} [tr.zu] Перевод на язык под кодом "zu" согласно ISO 639-1
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр :id неверный) {string="WRONG_PG_BIGSERIAL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр :id неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр enabled неверный) {string="WRONG_BOOLEAN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр enabled неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр tr неверный) {string="WRONG_OBJECT"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр tr неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр tr[*] неверный) {string="WRONG_PG_ENUM"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр tr[*] неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр tr* неверный) {string="WRONG_NOT_EMPTY_STRING"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр tr* неверный) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 * @apiUse v000AuthRequireModerator
 */
router.post("/:id", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      enabled: {
        Unit: BooleanUnit,
        optional: true,
      },
      tr: {
        Unit: ObjectUnit,
        optional: true,
        payload: {
          [ObjectUnit.ENUM_KEY]: {
            Unit: PgEnumUnit,
            payload: {
              cache: PgEnumUnitCacheMemory,
              client: PgEnumUnitClient,
              enumName: "LANGUAGE_CODE",
            },
          },
          [ObjectUnit.ENUM_VALUE]: {
            Unit: NotEmptyStringUnit,
          },
        },
      },
    },
  },
  params: {
    Unit: ObjectUnit,
    payload: {
      id: {
        Unit: PgBigSerialUnit,
      },
    },
  },
}).middleware, async (req, res) => {
  await res.achain
    .action(async () => {
      await Sequelize.instance.transaction(async () => {
        if (req.body.value.enabled) {
          await Sequelize.instance.stuff.update({
            enabled: req.body.value.enabled.value,
          }, {
            where: {
              id: req.params.value.id.value,
            },
          });
        }
        if (req.body.value.tr) {
          await Sequelize.instance.stuffTranslations.destroy({
            where: {
              stuffid: req.params.value.id.value,
            },
          });
          await Sequelize.instance.stuffTranslations.bulkCreate(
            Object.keys(req.body.value.tr.value).map((key) => {
              return {
                code: key,
                stuffid: req.params.value.id.value,
                translation: {
                  title: req.body.value.tr.value[key].value,
                },
              };
            }));
        }
      });
    })
    .send204()
    .execute();
});
