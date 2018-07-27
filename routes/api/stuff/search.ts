import {
  BooleanUnit,
  NotEmptyStringUnit,
  ObjectUnit,
  PgBigSerialUnit,
  PgEnumUnit,
  PgEnumUnitCacheMemory,
  PgEnumUnitClient,
  PgLimitUnit,
  PgOffsetUnit,
  RequestValidator,
} from "@alendo/express-req-validator";

import {Router} from "express";
import * as _ from "lodash";
import * as sequelize from "sequelize";

import {IStuffInstance, IStuffTranslation, IStuffTranslationsInstance, Sequelize} from "src";

const router = Router();
export default router;

/**
 * @api {post} /stuff/search Поиск по материалам
 * @apiVersion 0.0.0
 * @apiName Search
 * @apiGroup Stuff
 * @apiPermission Пользователь
 *
 * @apiDescription Результаты отсортированы по переводам в порядке возрастания
 *
 * @apiParam {string="ISO 639-1 в нижнем регистре"} [code] Фильтр по коду языка перевода
 * @apiParam {boolean} [enabled] Фильтр по включеному состоянию
 * @apiParam {string="1..9223372036854775807"} [id] Фильтр по ID материала
 * @apiParam {string="0..9223372036854775807"} [limit] Лимит
 * @apiParam {string="0..9223372036854775807"} [offset] Оффсет
 * @apiParam {string} [translation] Фильтр по переводу (без учета регистра)
 *
 * @apiSuccess {object[]} stuffs Массив материалов
 * @apiSuccess {boolean} stuffs.enabled Включен ли материал?
 * @apiSuccess {string="1..9223372036854775807"} stuffs.id ID материала
 * @apiSuccess {object} stuffs.tr Переводы
 * @apiSuccess {string} [stuffs.tr.aa] Перевод на язык под кодом "aa" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ab] Перевод на язык под кодом "ab" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ae] Перевод на язык под кодом "ae" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.af] Перевод на язык под кодом "af" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ak] Перевод на язык под кодом "ak" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.am] Перевод на язык под кодом "am" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.an] Перевод на язык под кодом "an" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ar] Перевод на язык под кодом "ar" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.as] Перевод на язык под кодом "as" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.av] Перевод на язык под кодом "av" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ay] Перевод на язык под кодом "ay" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.az] Перевод на язык под кодом "az" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ba] Перевод на язык под кодом "ba" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.be] Перевод на язык под кодом "be" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.bg] Перевод на язык под кодом "bg" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.bh] Перевод на язык под кодом "bh" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.bi] Перевод на язык под кодом "bi" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.bm] Перевод на язык под кодом "bm" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.bn] Перевод на язык под кодом "bn" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.bo] Перевод на язык под кодом "bo" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.br] Перевод на язык под кодом "br" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.bs] Перевод на язык под кодом "bs" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ca] Перевод на язык под кодом "ca" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ce] Перевод на язык под кодом "ce" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ch] Перевод на язык под кодом "ch" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.co] Перевод на язык под кодом "co" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.cr] Перевод на язык под кодом "cr" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.cs] Перевод на язык под кодом "cs" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.cu] Перевод на язык под кодом "cu" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.cv] Перевод на язык под кодом "cv" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.cy] Перевод на язык под кодом "cy" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.da] Перевод на язык под кодом "da" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.de] Перевод на язык под кодом "de" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.dv] Перевод на язык под кодом "dv" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.dz] Перевод на язык под кодом "dz" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ee] Перевод на язык под кодом "ee" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.el] Перевод на язык под кодом "el" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.en] Перевод на язык под кодом "en" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.eo] Перевод на язык под кодом "eo" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.es] Перевод на язык под кодом "es" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.et] Перевод на язык под кодом "et" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.eu] Перевод на язык под кодом "eu" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.fa] Перевод на язык под кодом "fa" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ff] Перевод на язык под кодом "ff" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.fi] Перевод на язык под кодом "fi" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.fj] Перевод на язык под кодом "fj" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.fl] Перевод на язык под кодом "fl" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.fo] Перевод на язык под кодом "fo" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.fr] Перевод на язык под кодом "fr" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.fy] Перевод на язык под кодом "fy" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ga] Перевод на язык под кодом "ga" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.gd] Перевод на язык под кодом "gd" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.gl] Перевод на язык под кодом "gl" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.gn] Перевод на язык под кодом "gn" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.gu] Перевод на язык под кодом "gu" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.gv] Перевод на язык под кодом "gv" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ha] Перевод на язык под кодом "ha" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.he] Перевод на язык под кодом "he" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.hi] Перевод на язык под кодом "hi" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ho] Перевод на язык под кодом "ho" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.hr] Перевод на язык под кодом "hr" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ht] Перевод на язык под кодом "ht" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.hu] Перевод на язык под кодом "hu" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.hy] Перевод на язык под кодом "hy" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.hz] Перевод на язык под кодом "hz" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ia] Перевод на язык под кодом "ia" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.id] Перевод на язык под кодом "id" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ie] Перевод на язык под кодом "ie" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ig] Перевод на язык под кодом "ig" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ii] Перевод на язык под кодом "ii" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ik] Перевод на язык под кодом "ik" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.io] Перевод на язык под кодом "io" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.is] Перевод на язык под кодом "is" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.it] Перевод на язык под кодом "it" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.iu] Перевод на язык под кодом "iu" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ja] Перевод на язык под кодом "ja" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.jv] Перевод на язык под кодом "jv" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ka] Перевод на язык под кодом "ka" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.kg] Перевод на язык под кодом "kg" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ki] Перевод на язык под кодом "ki" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.kj] Перевод на язык под кодом "kj" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.kk] Перевод на язык под кодом "kk" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.kl] Перевод на язык под кодом "kl" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.km] Перевод на язык под кодом "km" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.kn] Перевод на язык под кодом "kn" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ko] Перевод на язык под кодом "ko" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.kr] Перевод на язык под кодом "kr" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ks] Перевод на язык под кодом "ks" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ku] Перевод на язык под кодом "ku" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.kv] Перевод на язык под кодом "kv" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.kw] Перевод на язык под кодом "kw" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ky] Перевод на язык под кодом "ky" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.la] Перевод на язык под кодом "la" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.lb] Перевод на язык под кодом "lb" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.lg] Перевод на язык под кодом "lg" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.li] Перевод на язык под кодом "li" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ln] Перевод на язык под кодом "ln" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.lo] Перевод на язык под кодом "lo" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.lt] Перевод на язык под кодом "lt" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.lu] Перевод на язык под кодом "lu" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.lv] Перевод на язык под кодом "lv" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.mg] Перевод на язык под кодом "mg" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.mh] Перевод на язык под кодом "mh" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.mi] Перевод на язык под кодом "mi" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.mk] Перевод на язык под кодом "mk" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ml] Перевод на язык под кодом "ml" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.mn] Перевод на язык под кодом "mn" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.mr] Перевод на язык под кодом "mr" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ms] Перевод на язык под кодом "ms" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.mt] Перевод на язык под кодом "mt" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.my] Перевод на язык под кодом "my" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.na] Перевод на язык под кодом "na" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.nb] Перевод на язык под кодом "nb" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.nd] Перевод на язык под кодом "nd" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ne] Перевод на язык под кодом "ne" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ng] Перевод на язык под кодом "ng" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.nl] Перевод на язык под кодом "nl" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.nn] Перевод на язык под кодом "nn" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.no] Перевод на язык под кодом "no" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.nr] Перевод на язык под кодом "nr" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.nv] Перевод на язык под кодом "nv" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ny] Перевод на язык под кодом "ny" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.oc] Перевод на язык под кодом "oc" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.oj] Перевод на язык под кодом "oj" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.om] Перевод на язык под кодом "om" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.or] Перевод на язык под кодом "or" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.os] Перевод на язык под кодом "os" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.pa] Перевод на язык под кодом "pa" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.pi] Перевод на язык под кодом "pi" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.pl] Перевод на язык под кодом "pl" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ps] Перевод на язык под кодом "ps" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.pt] Перевод на язык под кодом "pt" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.qu] Перевод на язык под кодом "qu" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.rm] Перевод на язык под кодом "rm" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.rn] Перевод на язык под кодом "rn" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ro] Перевод на язык под кодом "ro" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ru] Перевод на язык под кодом "ru" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.rw] Перевод на язык под кодом "rw" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sa] Перевод на язык под кодом "sa" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sc] Перевод на язык под кодом "sc" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sd] Перевод на язык под кодом "sd" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.se] Перевод на язык под кодом "se" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sg] Перевод на язык под кодом "sg" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.si] Перевод на язык под кодом "si" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sk] Перевод на язык под кодом "sk" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sl] Перевод на язык под кодом "sl" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sm] Перевод на язык под кодом "sm" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sn] Перевод на язык под кодом "sn" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.so] Перевод на язык под кодом "so" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sq] Перевод на язык под кодом "sq" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sr] Перевод на язык под кодом "sr" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ss] Перевод на язык под кодом "ss" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.st] Перевод на язык под кодом "st" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.su] Перевод на язык под кодом "su" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sv] Перевод на язык под кодом "sv" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.sw] Перевод на язык под кодом "sw" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ta] Перевод на язык под кодом "ta" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.te] Перевод на язык под кодом "te" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.tg] Перевод на язык под кодом "tg" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.th] Перевод на язык под кодом "th" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ti] Перевод на язык под кодом "ti" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.tk] Перевод на язык под кодом "tk" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.tl] Перевод на язык под кодом "tl" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.tn] Перевод на язык под кодом "tn" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.to] Перевод на язык под кодом "to" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.tr] Перевод на язык под кодом "tr" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ts] Перевод на язык под кодом "ts" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.tt] Перевод на язык под кодом "tt" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.tw] Перевод на язык под кодом "tw" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ty] Перевод на язык под кодом "ty" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ug] Перевод на язык под кодом "ug" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.uk] Перевод на язык под кодом "uk" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ur] Перевод на язык под кодом "ur" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.uz] Перевод на язык под кодом "uz" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.ve] Перевод на язык под кодом "ve" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.vi] Перевод на язык под кодом "vi" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.vo] Перевод на язык под кодом "vo" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.wa] Перевод на язык под кодом "wa" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.wo] Перевод на язык под кодом "wo" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.xh] Перевод на язык под кодом "xh" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.yi] Перевод на язык под кодом "yi" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.yo] Перевод на язык под кодом "yo" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.za] Перевод на язык под кодом "za" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.zh] Перевод на язык под кодом "zh" согласно ISO 639-1
 * @apiSuccess {string} [stuffs.tr.zu] Перевод на язык под кодом "zu" согласно ISO 639-1
 *
 * @apiError (Bad Request 400 - Параметр равен null) {string="OBJECT_NULL_VALUE"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр равен null) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр code неверный) {string="WRONG_PG_ENUM"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр code неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр enabled неверный) {string="WRONG_BOOLEAN"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр enabled неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр id неверный) {string="WRONG_PG_BIGSERIAL"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр id неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр limit неверный) {string="WRONG_PG_LIMIT"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр limit неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр offset неверный) {string="WRONG_PG_OFFSET"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр offset неверный) {string} message Подробное описание ошибки
 *
 * @apiError (Bad Request 400 - Параметр translation неверный) {string="WRONG_NOT_EMPTY_STRING"} code Код ошибки
 * @apiError (Bad Request 400 - Параметр translation неверный) {string} message Подробное описание ошибки
 *
 * @apiUse v000CommonHeaders
 * @apiUse v000AuthAuth
 */
router.post("/", new RequestValidator({
  body: {
    Unit: ObjectUnit,
    payload: {
      code: {
        Unit: PgEnumUnit,
        optional: true,
        payload: {
          cache: PgEnumUnitCacheMemory,
          client: PgEnumUnitClient,
          enumName: "LANGUAGE_CODE",
        },
      },
      enabled: {
        Unit: BooleanUnit,
        optional: true,
      },
      id: {
        Unit: PgBigSerialUnit,
        optional: true,
      },
      limit: {
        Unit: PgLimitUnit,
        optional: true,
      },
      offset: {
        Unit: PgOffsetUnit,
        optional: true,
      },
      translation: {
        Unit: NotEmptyStringUnit,
        optional: true,
      },
    },
  },
}).middleware, async (req, res) => {
  let result: IStuffInstance[] = [];
  await res.achain
    .action(async () => {
      result = await Sequelize.instance.stuff.findAll(_.pickBy({
        include: [{
          model: Sequelize.instance.stuffTranslations,
          where: _.pickBy({
            code: req.body.value.code ? req.body.value.code.value : undefined,
            translation: req.body.value.translation ? {
              title: {
                [Sequelize.op.iLike]: `%${req.body.value.translation.value}%`,
              },
            } : undefined,
          }, (v) => v !== undefined),
        }],
        limit: req.body.value.limit ? req.body.value.limit.value : undefined,
        offset: req.body.value.offset ? req.body.value.offset.value : undefined,
        order: [
          [Sequelize.instance.stuffTranslations, sequelize.json("translation.title"), "ASC"],
        ],
        where: _.pickBy({
          enabled: req.body.value.enabled ? req.body.value.enabled.value : undefined,
          id: req.body.value.id ? req.body.value.id.value : undefined,
        }, (v) => v !== undefined),
      }));
    })
    .json(() => {
      return {
        stuffs: result.map((stuff) => {
          const tr: { [key: string]: string } = {};
          for (const trItem of (stuff as any).stuff_translations as IStuffTranslationsInstance[]) {
            tr[trItem.code as string] = (trItem.translation as IStuffTranslation).title;
          }
          return {
            enabled: stuff.enabled,
            id: stuff.id,
            tr,
          };
        }),
      };
    })
    .execute();
});
