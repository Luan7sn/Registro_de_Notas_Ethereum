pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Score.sol";

contract TestScore {
 
    Score score = Score(DeployedAddresses.Score());

    uint[4] expectedId = [2, 3, 4, 5];

    address expectedGrader = address(this);

    function testUserCanGrade() public {
        
        uint[4] memory returnedId = score.grade(expectedId[0], expectedId[1], expectedId[2], expectedId[3]);

        Assert.equal(returnedId, expectedId, "Score should match what is returned.");
    }

    function testGetIdAddressById() public {
        
        address grader = score.id(expectedId);

        Assert.equal(grader, expectedGrader, "Grader should be this contract");
    }

    function testGetIdAddressByIdInArray() public {
        
        address[16] memory id = score.getId();

        Assert.equal(id[expectedId], expectedGrader, "Grader of the expected score should be this contract");
    }
}