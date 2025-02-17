# n8n - Workflow Automation Tool

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

n8n is an extendable workflow automation tool. With a [fair-code](http://faircode.io) distribution model, n8n will always have visible source code, be available to self-host, and allow you to add your own custom functions, logic and apps. n8n's node-based approach makes it highly versatile, enabling you to connect anything to everything.

<a href="https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-screenshot.png"><img src="https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-screenshot.png" width="550" alt="n8n.io - Screenshot"></a>

## n8n for Linked Data Similarity library

This fork is to use the [LDS Java Library (*Linked Data Similarity*)](https://github.com/FouadKom/lds). It provides 4 new nodes:

- **LdsSimilarity**: calculate the semantic similarity between one or more pairs of concepts.
- **LdsDataset**: configure the dataset (e.g. dbpedia).
- **LdsMicroMeasure**: calculate the similarity between two properties of one pair of concepts.
- **LdsMicroMeasureAggregation**: provides 3 types of aggregation function to apply on the results of the LdsMicroMeasure node (average, min, max).

To use this repository:

- Clone this repo using the git clone command.
- Use a terminal and change the working directory into the root directory of this version of n8n.
- Build the project:
  - `lerna bootstrap --hoist && npm run build`
- Run the project:
  - `npm run dev` if you want to edit the source code (developement mode)
  - `npm run start` otherwise.

You can find some workflow examples [here](https://github.com/Asteda/n8n/tree/master/workflows-examples).

## Demo

[:tv: A short demo (< 3 min)](https://www.youtube.com/watch?v=3w7xIMKLVAg) which shows how to create a simple workflow which
automatically sends a new Slack notification every time a Github repository
received or lost a star.

## Available integrations

n8n has 200+ different nodes to automate workflows. The list can be found on: [https://n8n.io/nodes](https://n8n.io/nodes)


## Documentation

The official n8n documentation can be found under: [https://docs.n8n.io](https://docs.n8n.io)

Additional information and example workflows on the n8n.io website: [https://n8n.io](https://n8n.io)

The changelog can be found [here](https://docs.n8n.io/reference/changelog.html) and the list of breaking changes [here](https://github.com/n8n-io/n8n/blob/master/packages/cli/BREAKING-CHANGES.md).


## Usage

- :books: Learn [how to **install** and **use** it from the command line](https://github.com/n8n-io/n8n/tree/master/packages/cli/README.md)
- :whale: Learn [how to run n8n in **Docker**](https://github.com/n8n-io/n8n/tree/master/docker/images/n8n/README.md)



## Start

Execute: `npm run start`



## n8n.cloud

Sign-up for an [n8n.cloud](https://www.n8n.cloud/) account.

While n8n.cloud and n8n are the same in terms of features, n8n.cloud provides certain conveniences such as:
- Not having to set up and maintain your n8n instance
- Managed OAuth for authentication
- Easily upgrading to the newer n8n versions



## Support

If you have problems or questions go to our forum, we will then try to help you asap:

[https://community.n8n.io](https://community.n8n.io)



## Jobs

If you are interested in working for n8n and so shape the future of the project
check out our [job posts](https://apply.workable.com/n8n/)



## What does n8n mean and how do you pronounce it?

**Short answer:** It means "nodemation" and it is pronounced as n-eight-n.

**Long answer:** "I get that question quite often (more often than I expected)
so I decided it is probably best to answer it here. While looking for a
good name for the project with a free domain I realized very quickly that all the
good ones I could think of were already taken. So, in the end, I chose
nodemation. 'node-' in the sense that it uses a Node-View and that it uses
Node.js and '-mation' for 'automation' which is what the project is supposed to help with.
However, I did not like how long the name was and I could not imagine writing
something that long every time in the CLI. That is when I then ended up on
'n8n'." - **Jan Oberhauser, Founder and CEO, n8n.io**



## Development Setup

Have you found a bug :bug: ? Or maybe you have a nice feature :sparkles: to contribute ? The [CONTRIBUTING guide](https://github.com/n8n-io/n8n/blob/master/CONTRIBUTING.md) will help you get your development environment ready in minutes.



## License

n8n is [fair-code](http://faircode.io) distributed under [**Apache 2.0 with Commons Clause**](https://github.com/n8n-io/n8n/blob/master/packages/cli/LICENSE.md) license.

Additional information about license can be found in the [FAQ](https://docs.n8n.io/#/faq?id=license).
