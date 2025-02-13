const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const db = require("../database/database");
const {getCandidateList,checkVoteExistOrNot ,storeVote,getAllVotes} = require("../mysql_query/query");

// get candidate list
exports.getCandidateList = catchAsyncErrors(async (req, res, next) => {

  const [result] = await db.query(getCandidateList);
  res.status(200).json({
    success: true,
    candidate_list:result ,
  });
});

exports.checkForVoteExistOrNot = catchAsyncErrors(async (req, res, next) => {
    const user_id = req.user.user_id
    const [result] = await db.query(checkVoteExistOrNot,[user_id]);
    if(result[0]){
        return next(new ErrorHander("you already voted", 400));
    }

    res.status(200).json({
      success: true,
      message:"your can vote" ,
    });
  });

// vote to candidate
exports.storeVote = catchAsyncErrors(async (req, res, next) => {
    const candidate_id = req.params.candidate_id
    const user_id = req.user.user_id
    // const [result] = await db.query(checkVoteExistOrNot,[user_id]);

    // if(result[0]){
    //     return next(new ErrorHander("you already voted", 400));
    // }
    const insertResult = await db.query(storeVote,[candidate_id,user_id,new Date().toISOString().slice(0, 19).replace("T", " ")]);

    if (!insertResult) {
        return next(new ErrorHander("error in insert query", 400));
      }

    res.status(200).json({
      success: true,
      message:"your vote recorded" ,
    });
  });


  exports.getAllVotes = catchAsyncErrors(async (req, res, next) => {

    const [result] = await db.query(getAllVotes);
    // console.log(result)

    if (!result) {
        return next(new ErrorHander("error in select query", 400));
      }

      const votes_array = result.map((vote)=>vote.total_vote)
      const total_vote = votes_array.reduce((accum,currentVal)=>accum+ currentVal,0)

    res.status(200).json({
      success: true,
      total_vote:total_vote,
      data:result ,
    });
  });

