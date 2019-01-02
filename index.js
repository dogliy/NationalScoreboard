const funcitons=require('./files/funcitons');
const express=require('express');
const port=process.env.PORT || 3000;
var app=express();
const error=require('./files/error');


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/getAllTournaments',error(funcitons.getAllTournaments));
app.get("/getTournament/:TournamentId",error(funcitons.getTournamentById));
app.get('/addPlayerToTournament',error(funcitons.addPlayerToTournament));
app.post('/addNewTournament',error(funcitons.addNewTournament));
app.get('/showTournamentsBetweenDates',error(funcitons.showTournamentsBetweenDates));
app.all('*',(req,res)=>{
    res.send('did not found page');
});
app.listen(port);

console.log(`listining on ${port}`);