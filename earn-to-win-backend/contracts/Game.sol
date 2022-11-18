// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Game__NotEnoughETHEntered();
error Game__TransferFailed();
error Game__NotOpen();
error Game__UpkeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 gameState
);

/**@title A sample Game Contract
 * @author Yousuf Ejaz Ahmad
 * @notice This contract is for creating a sample Game contract
 * @dev This implements the  Chainlink Automation
 */

contract Game is KeeperCompatibleInterface {
    // Type Declarations
    enum GameState {
        OPEN,
        CALCULATING
    }
    // Storage Variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    mapping(address => uint) public s_scores;
    uint256 private s_flag;

    // Lottery Variables
    address private s_recentWinner;
    GameState private s_gameState;
    uint256 private immutable i_interval;
    uint256 private s_lastTimeStamp;

    // Events
    event GameEnter(address indexed player);
    event WinnerPicked(address indexed winner);

    constructor(uint256 entranceFee, uint256 interval) {
        i_entranceFee = entranceFee;
        s_gameState = GameState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
        s_flag = 0;
    }

    // Functions

    function enterGame() public payable {
        if (msg.value < i_entranceFee) {
            revert Game__NotEnoughETHEntered();
        }
        if (s_gameState != GameState.OPEN) {
            revert Game__NotOpen();
        }
        s_players.push(payable(msg.sender));
        s_scores[payable(msg.sender)] = 0;
        emit GameEnter(msg.sender);
    }

    function getWinner() internal {
        uint256 indexOfWinner = 0;
        uint256 maxScore = 0;
        for (uint256 i = 0; i < s_players.length; ++i) {
            if (s_scores[s_players[i]] > maxScore) {
                indexOfWinner = i;
                maxScore = s_scores[s_players[i]];
            }
        }

        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_players = new address payable[](0);
        s_gameState = GameState.OPEN;
        s_lastTimeStamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Game__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool isOpen = GameState.OPEN == s_gameState;
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers);
        return (upkeepNeeded, "0x0");
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Game__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_gameState)
            );
        }

        s_gameState = GameState.CALCULATING;
        s_flag = 1 - s_flag;
        getWinner();
    }

    // View / Pure functions
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getGameState() public view returns (GameState) {
        return s_gameState;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLatestTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getFlag() public view returns (uint256) {
        return s_flag;
    }

    function getScore(address _addr) public view returns (uint) {
        return s_scores[_addr];
    }

    function setScore(address _addr, uint _i) public {
        s_scores[_addr] = _i;
    }
}
