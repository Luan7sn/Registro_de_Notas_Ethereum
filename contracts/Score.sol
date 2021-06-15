pragma solidity ^0.5.0;

contract Score {

    address[16] public id;
    uint[16] public portugues;
    uint[16] public matematica;
    uint[16] public ciencias;

    function grade(uint Id, uint poScore, uint maScore, uint ciScore) public returns (uint) {
    
        require(Id >= 0 && Id <= 15);
        require(poScore >= 0 && poScore <= 10);
        require(maScore >= 0 && maScore <= 10);
        require(ciScore >= 0 && ciScore <= 10);

        id[Id] = msg.sender;
        portugues[Id] = poScore;
        matematica[Id] = maScore;
        ciencias[Id] = ciScore;

        return Id;
    }

    function getId() public view returns (address[16] memory) {
    
        return id;
    }

    function getPortugues() public view returns (uint[16] memory) {
    
        return portugues;
    }

    function getMatematica() public view returns (uint[16] memory) {
    
        return matematica;
    }

    function getCiencias() public view returns (uint[16] memory) {
    
        return ciencias;
    }

}