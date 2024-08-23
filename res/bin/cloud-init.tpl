#cloud-config
package_update: true
package_upgrade: true
packages:
  - git
  - curl
  - apt-transport-https
  - ca-certificates
  - software-properties-common
  - ufw
disable_root: true
hostname: $HOSTNAME
users:
  - default 
  - name: carmel
    ssh-authorized-keys:
      - $SSH_PUBLIC_KEY
    sudo:   
      - ALL=(ALL) NOPASSWD:ALL
    lock_passwd: true
    groups: 
      - sudo
      - users
      - admin
    shell: /bin/bash

write_files:
  - content: |
      #!/bin/bash
      cd /home/carmel
      touch .env
      mkdir .carmel
      mkdir .nvm
      mkdir dev
      echo CARMEL_DIR=/home/carmel > .env
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
      source ~/.bashrc
      source ~/.nvm/nvm.sh
      nvm install 20.16.0
      npm i -g yarn
    path: /home/carmel/setup.sh
    permissions: "0755"
    owner: "carmel:carmel"
    defer: true

runcmd:
  - timedateclt
  - sudo timedatectl set-ntp on
  - sudo ufw default deny incoming
  - sudo ufw default allow outgoing
  - sudo ufw allow ssh
  - sudo ufw allow http
  - sudo ufw allow https
  - sudo ufw allow 9000:9100/tcp
  - sudo ufw disable
  - sudo ufw --force enable
  - sed -i '/PermitRootLogin/d' /etc/ssh/sshd_config
  - echo "PermitRootLogin no" >> /etc/ssh/sshd_config
  - systemctl restart sshd
  - [su, carmel, -c, "/home/carmel/setup.sh"]