// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CampaignFactoryV2 {
    address[] public deployedCampaigns;
    mapping(address => bool) public isCampaignDeleted;

    event CampaignCreated(address campaignAddress, address manager, uint minimumContribution);
    event CampaignDeleted(address campaignAddress);

    function createCampaign(uint minimum) public {
        CampaignV2 newCampaign = new CampaignV2(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
        emit CampaignCreated(address(newCampaign), msg.sender, minimum);
    }

    function markCampaignDeleted(address campaignAddress) external {
        require(CampaignV2(campaignAddress).manager() == msg.sender, "Only manager can delete");
        isCampaignDeleted[campaignAddress] = true;
        emit CampaignDeleted(campaignAddress);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

    function getActiveCampaigns() public view returns (address[] memory) {
        uint activeCount = 0;

        // Count active campaigns
        for (uint i = 0; i < deployedCampaigns.length; i++) {
            if (!isCampaignDeleted[deployedCampaigns[i]]) {
                activeCount++;
            }
        }

        // Create array of active campaigns
        address[] memory activeCampaigns = new address[](activeCount);
        uint currentIndex = 0;

        for (uint i = 0; i < deployedCampaigns.length; i++) {
            if (!isCampaignDeleted[deployedCampaigns[i]]) {
                activeCampaigns[currentIndex] = deployedCampaigns[i];
                currentIndex++;
            }
        }

        return activeCampaigns;
    }
}

contract CampaignV2 {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    mapping(address => uint) public contributions; // Track individual contributions
    address[] public contributorsList;
    uint public approversCount;
    bool public isClosed;

    event ContributionReceived(address contributor, uint amount);
    event RequestCreated(uint requestId, string description, uint value, address recipient);
    event RequestApproved(uint requestId, address approver);
    event RequestFinalized(uint requestId);
    event CampaignClosed(uint totalRefunded);

    modifier restricted() {
        require(msg.sender == manager, "Only manager can call this");
        _;
    }

    modifier notClosed() {
        require(!isClosed, "Campaign is closed");
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
        isClosed = false;
    }

    function contribute() public payable notClosed {
        require(msg.value >= minimumContribution, "Contribution below minimum");

        // Track first-time contributors
        if (!approvers[msg.sender]) {
            contributorsList.push(msg.sender);
            approvers[msg.sender] = true;
            approversCount++;
        }

        contributions[msg.sender] += msg.value;
        emit ContributionReceived(msg.sender, msg.value);
    }

    function createRequest(string memory description, uint value, address payable recipient)
        public
        restricted
        notClosed
    {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

        emit RequestCreated(requests.length - 1, description, value, recipient);
    }

    function approveRequest(uint index) public notClosed {
        Request storage request = requests[index];

        require(approvers[msg.sender], "Only contributors can approve");
        require(!request.approvals[msg.sender], "Already approved this request");

        request.approvals[msg.sender] = true;
        request.approvalCount++;

        emit RequestApproved(index, msg.sender);
    }

    function finalizeRequest(uint index) public restricted notClosed {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2), "Needs more approvals");
        require(!request.complete, "Request already completed");
        require(address(this).balance >= request.value, "Insufficient balance");

        request.recipient.transfer(request.value);
        request.complete = true;

        emit RequestFinalized(index);
    }

    // Delete campaign and refund all contributors
    function closeCampaignAndRefund() public restricted notClosed {
        isClosed = true;
        uint totalRefunded = 0;

        // Refund all contributors
        for (uint i = 0; i < contributorsList.length; i++) {
            address payable contributor = payable(contributorsList[i]);
            uint amount = contributions[contributor];

            if (amount > 0) {
                contributions[contributor] = 0;
                totalRefunded += amount;
                contributor.transfer(amount);
            }
        }

        emit CampaignClosed(totalRefunded);

        // Mark as deleted in factory
        CampaignFactoryV2 factory = CampaignFactoryV2(msg.sender);
        // Note: The factory's markCampaignDeleted should be called from frontend
    }

    // Emergency withdrawal for manager (if campaign is closed)
    function emergencyWithdraw() public restricted {
        require(isClosed, "Campaign must be closed first");
        require(address(this).balance > 0, "No balance to withdraw");

        payable(manager).transfer(address(this).balance);
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address, bool
    ) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            isClosed
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function getContributorsList() public view returns (address[] memory) {
        return contributorsList;
    }

    function getContribution(address contributor) public view returns (uint) {
        return contributions[contributor];
    }
}
