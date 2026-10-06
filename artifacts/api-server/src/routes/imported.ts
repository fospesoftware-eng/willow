import express, { Router } from "express";
import { requestContext } from "../request-context";
import { getAdminUser } from "../imported/lib/auth";
import { getSettings, getLakes, getExperiences } from "../imported/lib/store/content";
import { getPage } from "../imported/lib/store/pages";
import { defaultPages } from "../imported/lib/cms/defaults";
import { getBookingByRef, getBookingByStripeSession } from "../imported/lib/store/booking";
import { toBookingConfirmation } from "../lib/booking-confirmation";
import * as handler0 from "../imported/api/admin/bookings/[ref]/route";
import * as handler1 from "../imported/api/admin/bookings/route";
import * as handler2 from "../imported/api/admin/experiences/route";
import * as handler3 from "../imported/api/admin/lakes/route";
import * as handler4 from "../imported/api/admin/media/[name]/route";
import * as handler5 from "../imported/api/admin/media/route";
import * as handler6 from "../imported/api/admin/pages/[slug]/route";
import * as handler7 from "../imported/api/admin/pages/route";
import * as handler8 from "../imported/api/admin/settings/route";
import * as handler9 from "../imported/api/admin/slots/[id]/route";
import * as handler10 from "../imported/api/admin/slots/route";
import * as handler11 from "../imported/api/admin/stripe-settings/route";
import * as handler12 from "../imported/api/auth/login/route";
import * as handler13 from "../imported/api/auth/logout/route";
import * as handler14 from "../imported/api/contact/route";
import * as handler15 from "../imported/api/sauna/checkout/route";
import * as handler16 from "../imported/api/sauna/config/route";
import * as handler17 from "../imported/api/sauna/slots/route";
import * as handler18 from "../imported/api/stripe/webhook/route";

const router = Router();
router.use(express.raw({ type: () => true, limit: "10mb" }));
router.use((req,res,next) => requestContext.run({req,res},next));
router.get("/content/bootstrap", async (_req,res) => {
 const [settings,lakes,experiences,pages] = await Promise.all([getSettings(),getLakes(),getExperiences(),Promise.all(defaultPages.map(async p => [p.slug,await getPage(p.slug)]))]);
 res.json({settings,lakes,experiences,pages:Object.fromEntries(pages)});
});
router.get("/auth/session", async (_req,res) => {res.set("Cache-Control","no-store").json({user:await getAdminUser()});});
router.get("/booking/confirmation",async (req,res) => {
 res.set("Cache-Control","no-store");
 const ref=String(req.query.ref ?? ""), session=String(req.query.session_id ?? "");
 const booking = ref ? await getBookingByRef(ref) : session ? await getBookingByStripeSession(session) : null;
 res.json(toBookingConfirmation(booking));
});

const handlers = [
 ["/admin/bookings/:ref", handler0],
 ["/admin/bookings", handler1],
 ["/admin/experiences", handler2],
 ["/admin/lakes", handler3],
 ["/admin/media/:name", handler4],
 ["/admin/media", handler5],
 ["/admin/pages/:slug", handler6],
 ["/admin/pages", handler7],
 ["/admin/settings", handler8],
 ["/admin/slots/:id", handler9],
 ["/admin/slots", handler10],
 ["/admin/stripe-settings", handler11],
 ["/auth/login", handler12],
 ["/auth/logout", handler13],
 ["/contact", handler14],
 ["/sauna/checkout", handler15],
 ["/sauna/config", handler16],
 ["/sauna/slots", handler17],
 ["/stripe/webhook", handler18],
] as const;
for (const [path, handlersForPath] of handlers) {
 for (const [method,handler] of Object.entries(handlersForPath)) {
  if (!["GET","POST","PUT","PATCH","DELETE"].includes(method)) continue;
  router[method.toLowerCase() as "get"](path, async (req,res) => {
   const headers = new Headers();
   for (const [name,value] of Object.entries(req.headers)) {
    if(value!==undefined) headers.set(name,Array.isArray(value)?value.join(","):value);
   }
   const protocol=req.get("x-forwarded-proto")?.split(",")[0] || req.protocol;
   const webRequest=new Request(protocol+"://"+req.get("host")+req.originalUrl, {
    method:req.method, headers,
    ...(!["GET","HEAD"].includes(req.method)&&Buffer.isBuffer(req.body)?{body:req.body}:{}),
   });
   const response=await (handler as Function)(webRequest,{params:Promise.resolve(req.params)});
   res.status(response.status);
   response.headers.forEach((value:string,name:string)=>res.setHeader(name,value));
   res.send(Buffer.from(await response.arrayBuffer()));
  });
 }
}
export default router;
