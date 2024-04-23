// SPDX -License-Identifies: MIT

pragma solidity ^0.8.3;

contract HelloWolrd {
     event UpdatedMessages (string oldStr, string newStr);
     string public profile;

     constructor(string memory initMessage) {
        profile = initMessage;
     }

     function update(string memory newProfile) public {
        string memory oldProf = profile;
        profile = newProfile;
        emit UpdatedMessages(oldProf, newProfile);
     }
}

