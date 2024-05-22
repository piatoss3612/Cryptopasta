### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:3000.

### Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

### References

- [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)

You find yourself in the midst of the chaotic blockchain world, tasked with investigating and neutralizing reentrancy attacks orchestrated by a cunning hacker named The Phantom.

Armed with your expertise, formidable tools, and unyielding determination, you begin your mission to safeguard the Ethereum network.

### Current State:

- **Health Points:** 100
- **Fear:** 0
- **Hunger:** 0
- **Inventory:** Contract Analyzer, Security Patch, Blockchain Navigator

---

## Event 1:

Initial Investigation You stand at the entrance of the Ethereum Block Explorer, a digital realm where you can delve into the depths of smart contract code. The air is thick with static, and the hum of data flowing through the blockchain is almost audible.

In front of you are a series of smart contracts that have been flagged for potential reentrancy vulnerabilities. These contracts are crucial to various decentralized applications (dApps) and must be secured to prevent further chaos. You activate the **Contract Analyzer** and begin your investigation.

### Challenge:

Identify the Vulnerability

**Scenario:** You open the first smart contract on your list. The code is intricate, full of functions, mappings, and balance checks. Your Contract Analyzer indicates that there might be a critical reentrancy vulnerability hidden within this contract.

**Objective:** Carefully scan through the code and identify the vulnerability.

**What do you do next?** - Thoroughly read through each function, particularly focusing on any external calls that might be made during balance modifications.

- Use the tools at your disposal to highlight and pinpoint the potential reentrancy exploit. - Note down the line numbers and functions where the vulnerability exists. --- Please specify your next action, and we'll proceed with investigating the contract for vulnerabilities.
