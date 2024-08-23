#!/bin/bash

ROOT_DIR=.carmel
SSL=main
SSH=sshkey
HCLOUD_DATACENTER="hel1-dc2"
HCLOUD_TYPE=ccx13
HCLOUD_IMAGE=ubuntu-24.04

function ensure_not_exists () {
    if [ -d "$ROOT_DIR/relays/$1" ];  then
       echo "Relay ${1} already exists"
       exit 0
    fi
}

function ensure_exists () {
    if [ ! -d "$ROOT_DIR/relays/$1" ];  then
       echo "Relay ${1} does not exist"
       exit 0
    fi
}

function init () {
    RELAY_ROOT=$ROOT_DIR/relays/$1
    ensure_not_exists $1

    mkdir $RELAY_ROOT
    SSH_PUBLIC_KEY=$(cat ${ROOT_DIR}/ssh/${SSH}.pub)

    sed "s|\$SSH_PUBLIC_KEY|${SSH_PUBLIC_KEY}|g" bin/relay-cloud-init.tpl > bin/cloud-init.tmp0
    sed "s|\$HOSTNAME|${1}|g" bin/cloud-init.tmp0 > ${RELAY_ROOT}/cloud-init.yaml
    rm -rf bin/cloud-init.tmp*
}

function launch_hcloud () {
    RELAY_ROOT=$ROOT_DIR/relays/$1
    ensure_exists $1
    SSH_PUBLIC_KEY=$(cat ${ROOT_DIR}/ssh/${SSH}.pub)
    CLOUD_INIT_FILE="${RELAY_ROOT}/cloud-init.yaml"

    hcloud server create --name "$1" --type $HCLOUD_TYPE --image $HCLOUD_IMAGE --datacenter $HCLOUD_DATACENTER --ssh-key "main" --user-data-from-file "${CLOUD_INIT_FILE}"
    # multipass launch -n $NAME --cloud-init cloud-init.yaml --cpus 1 --disk 4G --memory 1G
}

function setup_hcloud () {
  RELAY_ROOT=$ROOT_DIR/relays/$1
    ensure_exists $1
    SSH_PUBLIC_KEY=$(cat ${ROOT_DIR}/ssh/${SSH}.pub)
    IP=$(hcloud server list | grep "${1}" | awk '{ print $4 }')

    scp -i ${ROOT_DIR}/ssh/${SSH} ${ROOT_DIR}/ssl/${SSL}.cert carmel@${IP}:/home/carmel/.carmel/ssl.cert 
    scp -i ${ROOT_DIR}/ssh/${SSH} ${ROOT_DIR}/ssl/${SSL}.key carmel@${IP}:/home/carmel/.carmel/ssl.key
    scp -i ${ROOT_DIR}/ssh/${SSH} ${ROOT_DIR}/ssh/gitkey carmel@${IP}:/home/carmel/.ssh/github
    scp -i ${ROOT_DIR}/ssh/${SSH} ${ROOT_DIR}/ssh/gitkey.pub carmel@${IP}:/home/carmel/.ssh/github.pub
    scp -i ${ROOT_DIR}/ssh/${SSH} bin/ssh.config carmel@${IP}:/home/carmel/.ssh/config

    ssh -i ${ROOT_DIR}/ssh/${SSH} carmel@${IP} "git clone github:carmelnetwork/relay.git dev/carmel-relay"  
}

function ssh_hcloud () {
    RELAY_ROOT=$ROOT_DIR/relays/$1
    ensure_exists $1

    # LOCALIP=$(multipass list | grep "${NAME}" | awk '{ print $3 }')
    IP=$(hcloud server list | grep "${1}" | awk '{ print $4 }')
    ssh -i ${ROOT_DIR}/ssh/${SSH} carmel@${IP}
}

function list_hcloud () {
    hcloud server list
}

case "$1" in
  init)
    init $2
    launch_hcloud $2
    ;;
  setup)
    setup_hcloud $2
    ;;
  list)
    list_hcloud $2
    ;;
  ssh)
    ssh_hcloud $2
    ;;
  *)
    ;;
esac