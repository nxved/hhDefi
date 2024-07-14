// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract HHDeFiPlatform is AccessControl {
    IERC20 public hhToken;
    address public owner;
    uint256 public baseInterestRate;
    uint256 public totalStaked;
    uint256 public totalBorrowed;
    uint256 public rewardRate;

    struct User {
        uint256 staked;
        uint256 borrowed;
        uint256 rewardDebt;
        uint256 lastStakeTime;
    }

    mapping(address => User) public users;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        hhToken = IERC20(0xabCE63e2d95486862B88d1BA04A8AA75e6f023ae);
        owner = msg.sender;
        baseInterestRate = 5;
        rewardRate = 2;
    }

    function setBaseInterestRate(uint256 _rate) external onlyRole(ADMIN_ROLE) {
        baseInterestRate = _rate;
    }

    function setRewardRate(uint256 _rate) external onlyRole(ADMIN_ROLE) {
        rewardRate = _rate;
    }

    function getDynamicInterestRate() public view returns (uint256) {
        uint256 utilizationRate = (totalBorrowed * 100) / totalStaked;
        return baseInterestRate + utilizationRate / 10;
    }

    function stake(uint256 _amount) external {
        User storage user = users[msg.sender];
        require(_amount > 0, "Cannot stake 0");

        hhToken.transferFrom(msg.sender, address(this), _amount);
        user.staked += _amount;
        user.rewardDebt += (_amount * baseInterestRate) / 100;
        user.lastStakeTime = block.timestamp;
        totalStaked += _amount;
    }

    function withdraw(uint256 _amount) external {
        User storage user = users[msg.sender];
        require(_amount > 0 && _amount <= user.staked, "Invalid amount");

        user.staked -= _amount;
        user.rewardDebt -= (_amount * baseInterestRate) / 100;
        hhToken.transfer(msg.sender, _amount);
        totalStaked -= _amount;
    }

    function claimRewards() external {
        User storage user = users[msg.sender];
        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "No rewards");

        hhToken.transfer(msg.sender, rewards);
        user.rewardDebt = 0;
        user.lastStakeTime = block.timestamp;
    }

    function calculateRewards(address _user) public view returns (uint256) {
        User storage user = users[_user];
        uint256 timeStaked = block.timestamp - user.lastStakeTime;
        uint256 rewards = (user.staked * rewardRate * timeStaked) /
            20 minutes /
            100;
        return rewards + user.rewardDebt;
    }

    function borrow(uint256 _amount) external {
        User storage user = users[msg.sender];
        uint256 dynamicRate = getDynamicInterestRate();
        require(
            _amount > 0 && _amount <= (user.staked * 50) / 100,
            "Invalid borrow amount"
        );

        user.borrowed += _amount;
        totalBorrowed += _amount;
        hhToken.transfer(msg.sender, _amount);
    }

    function repay(uint256 _amount) external {
        User storage user = users[msg.sender];
        uint256 dynamicRate = getDynamicInterestRate();
        require(
            _amount > 0 && _amount <= user.borrowed,
            "Invalid repay amount"
        );

        uint256 interest = (_amount * dynamicRate) / 100;
        user.borrowed -= _amount;
        totalBorrowed -= _amount;
        hhToken.transferFrom(msg.sender, address(this), _amount + interest);
    }
}
