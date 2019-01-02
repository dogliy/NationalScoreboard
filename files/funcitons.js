const connection=require('./connection');
const  Tournament=require('./schema');


module.exports={

        async getAllTournaments(req,res,next){
            console.log('here');
            const result=await Tournament.find({});
            if(result) res.json(result);
            else res.status(404).send(`not found`); 
        },
        async getTournamentById(req,res,next){
            
            const result=await Tournament.find({tournamentId:req.params.TournamentId});
            if(result){
             
                res.json(result);


            } 
            else res.status(404).send(`not found`);
        },
        async addPlayerToTournament(req,res,next){

            const result=await Tournament.find({tournamentId:req.query.TournamentId})
            console.log(req.query.TournamentId);
            if(result){

                if(result.length==0){

                    res.status(404).send(`not found`);

                }else{
                      
                    if(typeof req.query.PlayerId=='undefined' || typeof req.query.PlayerName=='undefined'){
                        res.send('plase send player name and player id');
                    }else{
                        console.log(result[0].competitor);
                        var flag=0;
                        for(let i=0;i<result[0].competitor.length;i++){
                            if(result[0].competitor[i].id==req.query.PlayerId)
                                flag=1;


                        }


                        if(flag==1){
                            console.log('player id allready exsit');
                            res.json('player id allready exsit');
                        }else{
                           
                                var playerArray=result[0].competitor;
                                var player={
                                    id:req.query.PlayerId,
                                    name:req.query.PlayerName
                                };
                                playerArray.push(player);
                                const condition={tournamentId:req.query.TournamentId};
                                const options={};
                                const doc={
                                        $push:{competitor:player}
                                };

                                Tournament.updateOne(condition,doc,options,(err,inResult)=>{

                                    if(err){
                                        console.log(`error ${err}`);
                                        res.json(`error ${err}`);

                                    }else{
                                        res.json(`you add plaer to tournament`);
                                    }

                                }
                            )


                        }


                    }

                }

        
            } 
            else res.status(404).send(`not found`);
        },
        async addNewTournament(req,res,next){

                const result=await Tournament.find({});

                if(result){
                    if(typeof req.body.tournamentName=='undefined' || typeof req.body.tournamentId=='undefined' || typeof req.body.date=='undefined' || typeof req.body.location=='undefined'){
                        res.json(`you did not enter all data`);
                    }else{
                        var flag=0;
                            for(let i=0;i<result.length;i++){
                                if(result[i].tournamentId==req.body.tournamentId)
                                    flag=1;
                            }
                            if(flag==1){
                                res.json('tournament Id allready exist');

                            }else{
                                    const newTournament=new Tournament({
                                        tournamentName:req.body.tournamentName,
                                        tournamentId:req.body.tournamentId,
                                        date:req.body.date,
                                        location:req.body.location,
                                        competitor:[]
                                    });

                                    newTournament.save((err)=>{
                                        if(err){
                                            res.json(err);

                                        }else{
                                            res.json(`you add new Tournament`);
                                        }
                                    });
                            }
                    }
                }else{

                    res.json(`error`);
                }
        },
        async showTournamentsBetweenDates(req,res,next){
            const result=await Tournament.find({});

            if(result){

              
            

                if(typeof req.query.startDate=='undefined' || typeof req.query.endDate=='undefined' ){
                    res.send('you did not enter all dates');
                }else{
                    if(req.query.startDate.length<10 || req.query.endDate.length<10)
                        res.send('dates not valid');
                    else{
                        var startDateDay=req.query.startDate[0]+req.query.startDate[1];
                        var startDatemonth=req.query.startDate[3]+req.query.startDate[4];
                        var startDateYear=req.query.startDate[6]+req.query.startDate[7]+req.query.startDate[8]+req.query.startDate[9];

                        var endDateDay=req.query.endDate[0]+req.query.endDate[1];
                        var endDatemonth=req.query.endDate[3]+req.query.endDate[4];
                        var endDateYear=req.query.endDate[6]+req.query.endDate[7]+req.query.endDate[8]+req.query.endDate[9];

                        startDateDay=parseInt(startDateDay);
                        startDatemonth=parseInt(startDatemonth);
                        startDateYear=parseInt(startDateYear);

                        endDateDay=parseInt(endDateDay);
                        endDatemonth=parseInt(endDatemonth);
                        endDateYear=parseInt(endDateYear);


                        var flag=0;

                        if( ( endDateYear<startDateYear  )  )
                            flag=1;
                        if(  endDateYear>=startDateYear && endDatemonth<startDatemonth  )
                            flag=1;
                        if ( endDateYear>=startDateYear && endDatemonth>=startDatemonth && endDateDay<startDateDay)
                            flag=1;

                        if(flag==1){
                            res.json('dates not valid');
                        }else{
                            
                            var returnArray=[];

                            for(let i=0;i<result.length;i++){
                               

                                var day=result[i].date[0]+result[i].date[1];
                                var month=result[i].date[3]+result[i].date[4];
                                var year=result[i].date[6]+result[i].date[7]+result[i].date[8]+result[i].date[9];

                              

                                day=parseInt(day);
                                month=parseInt(month);
                                year=parseInt(year);

                                console.log(startDateYear);
                                console.log(year);
                                console.log(endDateYear);
                                

                                if(  (year>startDateYear && year<endDateYear)  )
                                    returnArray.push(result[i]);
                                else if( (startDateYear!=endDateYear)  && (year==endDateYear) && (month<endDatemonth)      )
                                    returnArray.push(result[i]);
                                else if(  (startDateYear!=endDateYear)  && (year==endDateYear) && (month==endDatemonth) && (day<=endDateDay)   )
                                    returnArray.push(result[i]);
                                else if( (startDateYear!=endDateYear)  && (year==startDateYear) && (month>startDatemonth)      )
                                    returnArray.push(result[i]);
                                else if(  (startDateYear!=endDateYear)  && (year==startDateYear) && (month==startDatemonth) && (day>=startDateDay)   )
                                    returnArray.push(result[i]);
                                else if( (startDateYear==endDateYear)  && (month<endDatemonth&& month>startDatemonth) )
                                    returnArray.push(result[i]);
                                else if( (startDateYear==endDateYear) && ( endDatemonth!=startDatemonth ) && (month==endDatemonth) && (day<=endDateDay)  )
                                      returnArray.push(result[i]);
                                else if( (startDateYear==endDateYear) && ( endDatemonth!=startDatemonth ) && (month==startDatemonth) && (day>=startDateDay)  )
                                      returnArray.push(result[i]);
                                else if( (startDateYear==endDateYear) && ( endDatemonth==startDatemonth ) && (month==startDatemonth) && (day=>startDateDay && day<=endDateDay)  )
                                      returnArray.push(result[i]);
                            }
                            console.log(returnArray);
                            res.json(returnArray);
                        }
                    }
                }
            }else{
                res.status(404).send('not found');

            }

        }
}