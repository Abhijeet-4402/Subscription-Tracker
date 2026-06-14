import { Router } from "express";
import authorize  from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/',(req,res)=> res.send({title: "GET all subscriptions"}));

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.get('/upcoming-renewals',(req,res)=> res.send({title: "GET all upcoming renewals"}));

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.get('/:id',(req,res)=> res.send({title: "GET subscription details"}));

subscriptionRouter.put('/:id',(req,res)=> res.send({title: "UPDATE subscription"}));

subscriptionRouter.put('/:id/cancel',(req,res)=> res.send({title: "CANCEL subscription"}));

export default subscriptionRouter;