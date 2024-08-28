# Carmel CLI

## Install

1. Clone the `carmelnetwork/cli` repo

```
git clone github:carmelnetwork/cli.git
```

2. Add the repo to your path

```
export CARMEL_CLI_PATH=<path to your repo>
export PATH=$PATH:$CARMEL_CLI_PATH/bin
```

## Wallets

### List all wallets

```
carmel wallets list
```

### Create a new wallet

*default name: `main`*

```
carmel wallets create --name <name>
```

## Keys

### Create a key

*default config: `main/ssh`*

*config format: `<wallet name>/<type of key>`*

```
carmel keys create --config <config>
```

### Get a key

*default id: `main/eth/0`*

*id format: `<wallet name>/<type of key>/<key index>`*

```
carmel keys get --id <id>
```

**Examples:**

* the 3rd eth key: `carmel keys get --id main/eth/2`
* the 1st ssh key: `carmel keys get --id main/ssh/0`


## Nodes

### Create a node

### List nodes

### SSH into a node