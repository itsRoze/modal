# Modal

## About

Modal is an opinionated task manager. I am no longer actively working on this and the hosted version is down. However, feel free to self host (see next section for tech stack and configuration)

## Configuration and Tech Stack

Feel free to deploy this yourself but note you may run into some hiccups since that wasn't the original intention.

The infrastructure uses AWS via [SST v2](https://sst.dev/). You must enable the correct secrets (see `Secrets.ts`).

```shell
npx sst secrets set MY_SECRET abc
```

See more info: https://docs.sst.dev/packages/sst

Additionally you need to update the custom domain in `WebStack.ts`

The current version uses NextJS, Drizzle, and Planetscale.
