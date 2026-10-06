# Project Management of Zoth WebGen Foundry

Zoth WebGen Foundry is engineered by Neal Frazier Tech (@1nc0gn30) as part of the sovereign NullAI platform ecosystem.

> **Engineering Roadmap**: Tracked in the [NullAI Platform Hub](https://nullai.tech) and GitHub repository [1nc0gn30/zoth-webgen](https://github.com/1nc0gn30/zoth-webgen).

Here's how we structure long-term vision, mid-term capabilities of the software, and short-term improvements.

## Strategic Epics (Long-term)

Strategic epics define areas in which Zoth WebGen evolves. They allow the core team to define what is most important and should be worked on with the highest priority: WebContainers, Avant-Garde UI generation, autonomous multi-model reasoning, and sovereign deployment pipelines.

What's the benefit / purpose of epics?

1. Prioritization

E. g. we could say “managing files is currently more important that quality”. Then, we could thing about which features
would bring “managing files” forward. It may be different features, such as “upload local files”, “import from a repo”
or also undo/redo/commit.

In a more-or-less regular meeting dedicated for that, the core team discusses which epics matter most, sketch features
and then check who can work on them. After the meeting, they update the roadmap (at least for the next development turn)
and this way communicate where the focus currently is.

2. Grouping of features

By linking features with epics, we can keep them together and document _why_ we invest work into a particular thing.

## Features (mid-term)

We all know probably a dozen of methodologies following which features are being described (User story, business
function, you name it).

However, we intentionally describe features in a more vague manner. Why? Everybody loves crisp, well-defined
acceptance-criteria, no? Well, every product owner loves it. because he knows what he’ll get once it’s done.

But: **here is no owner of this product**. Therefore, we grant _maximum flexibility to the developer contributing a feature_ – so that he can bring in his ideas and have most fun implementing it.

The feature therefore tries to describe _what_ should be improved but not in detail _how_.

## PRs as materialized features (short-term)

Once a developer starts working on a feature, a draft-PR _can_ be opened asap to share, describe and discuss, how the feature shall be implemented. But: this is not a must. It just helps to get early feedback and get other developers involved. Sometimes, the developer just wants to get started and then open a PR later.

In a loosely organized project, it may as well happen that multiple PRs are opened for the same feature. This is no real issue: Usually, peoply being passionate about a solution are willing to join forces and get it done together. And if a second developer was just faster getting the same feature realized: Be happy that it's been done, close the PR and look out for the next feature to implement 🤓

## PRs as change log

Once a PR is merged, a squashed commit contains the whole PR description which allows for a good change log.
All authors of commits in the PR are mentioned in the squashed commit message and become contributors 🙌
