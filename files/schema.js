const mongoose=require('mongoose');

const schema={
    "tournamentName":String,
    "tournamentId":String,
    "date":String,
    "location":String,
    "competitor":Array
}


const tournament_schema=mongoose.Schema(schema);
const tournament=mongoose.model('Tournament',tournament_schema,'tournaments');


module.exports=tournament;