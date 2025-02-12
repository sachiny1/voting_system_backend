const express = require("express");
const {
    getCandidateList,
    storeVote,
    checkForVoteExistOrNot,
    getAllVotes
} = require("../controller/voteController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/candidate-list").get(isAuthenticatedUser,getCandidateList);
router.route("/check").get(isAuthenticatedUser,checkForVoteExistOrNot);
router.route("/:candidate_id").get(isAuthenticatedUser,storeVote);
router.route("/admin/all").get(isAuthenticatedUser,authorizeRoles("admin"),getAllVotes);




module.exports = router;
