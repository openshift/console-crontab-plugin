# OpenShift CronTab Dynamic Plugin

This project is a minimal template for writing a new OpenShift Console dynamic
plugin. It requires OpenShift 4.11. For an example of a plugin that works with
OpenShift 4.10, see the `release-4.10` branch.

This project serves as a template for Console Dynamic Plugins, showing basic operations with a Custom Resource Definition such as creating, editing and deleting.

The CronTab Dynamic Plugin creates new menu entrie, routes, and  

This project is a standalone repository hosting the Kubevirt plugin
for OpenShift Console.

## Local development

### Option 1 (recommended): Docker + VSCode Remote Container

Make sure the [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
extension is installed. This method uses Docker Compose where one container is
the OpenShift console and the second container is the plugin. It requires that
you have access to an existing OpenShift cluster. After the initial build, the
cached containers will help you start developing in seconds.

1. Create a `dev.env` file inside the `.devcontainer` folder with the correct values for your cluster:

```bash
OC_PLUGIN_NAME=kubevirt-plugin
OC_URL=https://api.example.com:6443
OC_USER=kubeadmin
OC_PASS=<password>
```

2. `(Ctrl+Shift+P) => Remote Containers: Open Folder in Container...`
3. `yarn dev`
4. Navigate to <http://localhost:9000>

#### Cypress Testing inside the container

1. `yarn test-cypress-docker`
2. Navigate to <http://localhost:10000>
3. login with password `kubevirt` (no need for username)

### Option 2:

1. Set up [Console](https://github.com/openshift/console) and See the plugin development section in [Console Dynamic Plugins README](https://github.com/openshift/console/blob/master/frontend/packages/console-dynamic-plugin-sdk/README.md) for details on how to run OpenShift console using local plugins.
2. Run bridge with `-plugins kubevirt-plugin=http://localhost:9001`
3. Run `yarn dev` inside the plugin.

## Docker image

Before you can deploy your plugin on a cluster, you must build an image and
push it to an image registry.

1. Build the image:

   ```sh
   docker build -t $NAME/crontab-plugin:latest .
   ```

2. Run the image:

   ```sh
   docker run -it --rm -d -p 9001:80 quay.io/crontab-plugin/crontab-plugin:latest
   ```

3. Push the image:

   ```sh
   docker push quay.io/crontab-plugin/crontab-plugin:latest
   ```

NOTE: If you have a Mac with Apple silicon, you will need to add the flag
`--platform=linux/amd64` when building the image to target the correct platform
to run in-cluster.

## Deployment on cluster

After pushing an image with your changes to an image registry, you can deploy
the plugin to a cluster by instantiating the template:

```sh
oc apply -f oc-manifest.yaml
```

Once deployed, patch the
[Console operator](https://github.com/openshift/console-operator)
config to enable the plugin.

```sh
oc patch consoles.operator.openshift.io cluster \
  --patch '{ "spec": { "plugins": ["crontab-plugin"] } }' --type=merge
```
