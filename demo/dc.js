(function() {
  'use strict';

  // a quick service that returns a hard-coded deployment config so we
  // can mess with the data model we need to be able to work with in OpenShift
  angular
    .module('demo')
    .factory(
      'dc',
      [
        '$q',
        function($q) {
          return {
            // simulate API request
            get: function() {
              return $q.when({
                "kind": "DeploymentConfigList",
                "apiVersion": "v1",
                "metadata": {
                  "selfLink": "/oapi/v1/namespaces/stuff-and-things/deploymentconfigs",
                  "resourceVersion": "63156"
                },
                "items": [
                  {
                    "metadata": {
                      "name": "database",
                      "namespace": "stuff-and-things",
                      "selfLink": "/oapi/v1/namespaces/stuff-and-things/deploymentconfigs/database",
                      "uid": "fff1f385-070e-11e6-81e2-080027c5bfa9",
                      "resourceVersion": "4825",
                      "creationTimestamp": "2016-04-20T15:46:08Z",
                      "labels": {
                        "template": "application-template-stibuild"
                      }
                    },
                    "spec": {
                      "strategy": {
                        "type": "Recreate",
                        "recreateParams": {
                          "timeoutSeconds": 600,
                          "pre": {
                            "failurePolicy": "Abort",
                            "execNewPod": {
                              "command": [
                                "/bin/true"
                              ],
                              "env": [
                                {
                                  "name": "CUSTOM_VAR1",
                                  "value": "custom_value1"
                                }
                              ],
                              "containerName": "ruby-helloworld-database",
                              "volumes": [
                                "ruby-helloworld-data"
                              ]
                            }
                          },
                          "mid": {
                            "failurePolicy": "Abort",
                            "execNewPod": {
                              "command": [
                                "/bin/true"
                              ],
                              "env": [
                                {
                                  "name": "CUSTOM_VAR2",
                                  "value": "custom_value2"
                                }
                              ],
                              "containerName": "ruby-helloworld-database",
                              "volumes": [
                                "ruby-helloworld-data"
                              ]
                            }
                          },
                          "post": {
                            "failurePolicy": "Ignore",
                            "execNewPod": {
                              "command": [
                                "/bin/false"
                              ],
                              "env": [
                                {
                                  "name": "CUSTOM_VAR2",
                                  "value": "custom_value2"
                                }
                              ],
                              "containerName": "ruby-helloworld-database",
                              "volumes": [
                                "ruby-helloworld-data"
                              ]
                            }
                          }
                        },
                        "resources": {}
                      },
                      "triggers": [
                        {
                          "type": "ConfigChange"
                        }
                      ],
                      "replicas": 1,
                      "test": false,
                      "selector": {
                        "name": "database"
                      },
                      "template": {
                        "metadata": {
                          "creationTimestamp": null,
                          "labels": {
                            "name": "database"
                          }
                        },
                        "spec": {
                          "volumes": [
                            {
                              "name": "ruby-helloworld-data",
                              "emptyDir": {}
                            }
                          ],
                          "containers": [
                            {
                              "name": "ruby-helloworld-database",
                              "image": "openshift/mysql-55-centos7:latest",
                              "ports": [
                                {
                                  "containerPort": 3306,
                                  "protocol": "TCP"
                                }
                              ],
                              "env": [
                                {
                                  "name": "MYSQL_USER",
                                  "value": "user8E4"
                                },
                                {
                                  "name": "MYSQL_PASSWORD",
                                  "value": "ybqOpSMG"
                                },
                                {
                                  "name": "MYSQL_DATABASE",
                                  "value": "root"
                                }
                              ],
                              "resources": {},
                              "volumeMounts": [
                                {
                                  "name": "ruby-helloworld-data",
                                  "mountPath": "/var/lib/mysql/data"
                                }
                              ],
                              "terminationMessagePath": "/dev/termination-log",
                              "imagePullPolicy": "Always",
                              "securityContext": {
                                "capabilities": {},
                                "privileged": false
                              }
                            }
                          ],
                          "restartPolicy": "Always",
                          "terminationGracePeriodSeconds": 30,
                          "dnsPolicy": "ClusterFirst",
                          "securityContext": {}
                        }
                      }
                    },
                    "status": {
                      "latestVersion": 1,
                      "details": {
                        "causes": [
                          {
                            "type": "ConfigChange"
                          }
                        ]
                      }
                    }
                  },
                  {
                    "metadata": {
                      "name": "frontend",
                      "namespace": "stuff-and-things",
                      "selfLink": "/oapi/v1/namespaces/stuff-and-things/deploymentconfigs/frontend",
                      "uid": "fff23ab0-070e-11e6-81e2-080027c5bfa9",
                      "resourceVersion": "5060",
                      "creationTimestamp": "2016-04-20T15:46:08Z",
                      "labels": {
                        "template": "application-template-stibuild"
                      }
                    },
                    "spec": {
                      "strategy": {
                        "type": "Rolling",
                        "rollingParams": {
                          "updatePeriodSeconds": 1,
                          "intervalSeconds": 1,
                          "timeoutSeconds": 120,
                          "maxUnavailable": "25%",
                          "maxSurge": "25%",
                          "pre": {
                            "failurePolicy": "Abort",
                            "execNewPod": {
                              "command": [
                                "/bin/true"
                              ],
                              "env": [
                                {
                                  "name": "CUSTOM_VAR1",
                                  "value": "custom_value1"
                                }
                              ],
                              "containerName": "ruby-helloworld"
                            }
                          },
                          "post": {
                            "failurePolicy": "Ignore",
                            "execNewPod": {
                              "command": [
                                "/bin/false"
                              ],
                              "env": [
                                {
                                  "name": "CUSTOM_VAR2",
                                  "value": "custom_value2"
                                }
                              ],
                              "containerName": "ruby-helloworld"
                            }
                          }
                        },
                        "resources": {}
                      },
                      "triggers": [
                        {
                          "type": "ImageChange",
                          "imageChangeParams": {
                            "automatic": true,
                            "containerNames": [
                              "ruby-helloworld"
                            ],
                            "from": {
                              "kind": "ImageStreamTag",
                              "name": "origin-ruby-sample:latest"
                            },
                            "lastTriggeredImage": "172.30.55.228:5000/stuff-and-things/origin-ruby-sample@sha256:70698e09df727d1c62fff0592529546c47cb04cb1007f63fd8e551edf25bb8c5"
                          }
                        },
                        {
                          "type": "ConfigChange"
                        }
                      ],
                      "replicas": 2,
                      "test": false,
                      "selector": {
                        "name": "frontend"
                      },
                      "template": {
                        "metadata": {
                          "creationTimestamp": null,
                          "labels": {
                            "name": "frontend"
                          }
                        },
                        "spec": {
                          "containers": [
                            {
                              "name": "ruby-helloworld",
                              "image": "172.30.55.228:5000/stuff-and-things/origin-ruby-sample@sha256:70698e09df727d1c62fff0592529546c47cb04cb1007f63fd8e551edf25bb8c5",
                              "ports": [
                                {
                                  "containerPort": 8080,
                                  "protocol": "TCP"
                                }
                              ],
                              "env": [
                                {
                                  "name": "ADMIN_USERNAME",
                                  "value": "admin5IO"
                                },
                                {
                                  "name": "ADMIN_PASSWORD",
                                  "value": "uB8cgGmA"
                                },
                                {
                                  "name": "MYSQL_USER",
                                  "value": "user8E4"
                                },
                                {
                                  "name": "MYSQL_PASSWORD",
                                  "value": "ybqOpSMG"
                                },
                                {
                                  "name": "MYSQL_DATABASE",
                                  "value": "root"
                                }
                              ],
                              "resources": {},
                              "terminationMessagePath": "/dev/termination-log",
                              "imagePullPolicy": "IfNotPresent",
                              "securityContext": {
                                "capabilities": {},
                                "privileged": false
                              }
                            }
                          ],
                          "restartPolicy": "Always",
                          "terminationGracePeriodSeconds": 30,
                          "dnsPolicy": "ClusterFirst",
                          "securityContext": {}
                        }
                      }
                    },
                    "status": {
                      "latestVersion": 1,
                      "details": {
                        "causes": [
                          {
                            "type": "ImageChange",
                            "imageTrigger": {
                              "from": {
                                "kind": "ImageStreamTag",
                                "name": "origin-ruby-sample:latest"
                              }
                            }
                          }
                        ]
                      }
                    }
                  },
                  {
                    "metadata": {
                      "name": "node-stuffy-stuffs",
                      "namespace": "stuff-and-things",
                      "selfLink": "/oapi/v1/namespaces/stuff-and-things/deploymentconfigs/node-stuffy-stuffs",
                      "uid": "fd7ebe91-0729-11e6-81e2-080027c5bfa9",
                      "resourceVersion": "6472",
                      "creationTimestamp": "2016-04-20T18:59:20Z",
                      "labels": {
                        "app": "node-stuffy-stuffs"
                      },
                      "annotations": {
                        "openshift.io/generated-by": "OpenShiftWebConsole"
                      }
                    },
                    "spec": {
                      "strategy": {
                        "type": "Rolling",
                        "rollingParams": {
                          "updatePeriodSeconds": 1,
                          "intervalSeconds": 1,
                          "timeoutSeconds": 600,
                          "maxUnavailable": "25%",
                          "maxSurge": "25%"
                        },
                        "resources": {}
                      },
                      "triggers": [
                        {
                          "type": "ImageChange",
                          "imageChangeParams": {
                            "automatic": true,
                            "containerNames": [
                              "node-stuffy-stuffs"
                            ],
                            "from": {
                              "kind": "ImageStreamTag",
                              "name": "node-stuffy-stuffs:latest"
                            },
                            "lastTriggeredImage": "172.30.55.228:5000/stuff-and-things/node-stuffy-stuffs@sha256:f478bbb28bb711ca7e19420c6c361e8ee0277cc3f99f8949cfedea0102705363"
                          }
                        },
                        {
                          "type": "ConfigChange"
                        }
                      ],
                      "replicas": 1,
                      "test": false,
                      "selector": {
                        "deploymentconfig": "node-stuffy-stuffs"
                      },
                      "template": {
                        "metadata": {
                          "creationTimestamp": null,
                          "labels": {
                            "app": "node-stuffy-stuffs",
                            "deploymentconfig": "node-stuffy-stuffs"
                          }
                        },
                        "spec": {
                          "containers": [
                            {
                              "name": "node-stuffy-stuffs",
                              "image": "172.30.55.228:5000/stuff-and-things/node-stuffy-stuffs@sha256:f478bbb28bb711ca7e19420c6c361e8ee0277cc3f99f8949cfedea0102705363",
                              "ports": [
                                {
                                  "containerPort": 8080,
                                  "protocol": "TCP"
                                }
                              ],
                              "env": [
                                {
                                  "name": "PATH",
                                  "value": "/opt/app-root/src/node_modules/.bin/:/opt/app-root/src/bin:/opt/app-root/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
                                },
                                {
                                  "name": "STI_SCRIPTS_URL",
                                  "value": "image:///usr/libexec/s2i"
                                },
                                {
                                  "name": "STI_SCRIPTS_PATH",
                                  "value": "/usr/libexec/s2i"
                                },
                                {
                                  "name": "HOME",
                                  "value": "/opt/app-root/src"
                                },
                                {
                                  "name": "BASH_ENV",
                                  "value": "/opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "ENV",
                                  "value": "/opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "PROMPT_COMMAND",
                                  "value": ". /opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "NODEJS_VERSION",
                                  "value": "0.10"
                                }
                              ],
                              "resources": {},
                              "terminationMessagePath": "/dev/termination-log",
                              "imagePullPolicy": "Always"
                            }
                          ],
                          "restartPolicy": "Always",
                          "terminationGracePeriodSeconds": 30,
                          "dnsPolicy": "ClusterFirst",
                          "securityContext": {}
                        }
                      }
                    },
                    "status": {
                      "latestVersion": 2,
                      "details": {
                        "causes": [
                          {
                            "type": "ImageChange",
                            "imageTrigger": {
                              "from": {
                                "kind": "ImageStreamTag",
                                "name": "node-stuffy-stuffs:latest"
                              }
                            }
                          }
                        ]
                      }
                    }
                  },
                  {
                    "metadata": {
                      "name": "perly-white-things",
                      "namespace": "stuff-and-things",
                      "selfLink": "/oapi/v1/namespaces/stuff-and-things/deploymentconfigs/perly-white-things",
                      "uid": "e7f7ba73-0729-11e6-81e2-080027c5bfa9",
                      "resourceVersion": "6336",
                      "creationTimestamp": "2016-04-20T18:58:44Z",
                      "labels": {
                        "app": "perly-white-things"
                      },
                      "annotations": {
                        "openshift.io/generated-by": "OpenShiftWebConsole"
                      }
                    },
                    "spec": {
                      "strategy": {
                        "type": "Rolling",
                        "rollingParams": {
                          "updatePeriodSeconds": 1,
                          "intervalSeconds": 1,
                          "timeoutSeconds": 600,
                          "maxUnavailable": "25%",
                          "maxSurge": "25%"
                        },
                        "resources": {}
                      },
                      "triggers": [
                        {
                          "type": "ImageChange",
                          "imageChangeParams": {
                            "automatic": true,
                            "containerNames": [
                              "perly-white-things"
                            ],
                            "from": {
                              "kind": "ImageStreamTag",
                              "name": "perly-white-things:latest"
                            },
                            "lastTriggeredImage": "172.30.55.228:5000/stuff-and-things/perly-white-things@sha256:008e4d5769e408293f08466c0cf97e5442c6934f20b24cfcd20d59dade99fd35"
                          }
                        },
                        {
                          "type": "ConfigChange"
                        }
                      ],
                      "replicas": 1,
                      "test": false,
                      "selector": {
                        "deploymentconfig": "perly-white-things"
                      },
                      "template": {
                        "metadata": {
                          "creationTimestamp": null,
                          "labels": {
                            "app": "perly-white-things",
                            "deploymentconfig": "perly-white-things"
                          }
                        },
                        "spec": {
                          "containers": [
                            {
                              "name": "perly-white-things",
                              "image": "172.30.55.228:5000/stuff-and-things/perly-white-things@sha256:008e4d5769e408293f08466c0cf97e5442c6934f20b24cfcd20d59dade99fd35",
                              "ports": [
                                {
                                  "containerPort": 8080,
                                  "protocol": "TCP"
                                }
                              ],
                              "env": [
                                {
                                  "name": "PATH",
                                  "value": "/opt/app-root/src/bin:/opt/app-root/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/rh/perl516/root/usr/local/bin"
                                },
                                {
                                  "name": "STI_SCRIPTS_URL",
                                  "value": "image:///usr/libexec/s2i"
                                },
                                {
                                  "name": "STI_SCRIPTS_PATH",
                                  "value": "/usr/libexec/s2i"
                                },
                                {
                                  "name": "HOME",
                                  "value": "/opt/app-root/src"
                                },
                                {
                                  "name": "BASH_ENV",
                                  "value": "/opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "ENV",
                                  "value": "/opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "PROMPT_COMMAND",
                                  "value": ". /opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "PERL_VERSION",
                                  "value": "5.16"
                                }
                              ],
                              "resources": {},
                              "terminationMessagePath": "/dev/termination-log",
                              "imagePullPolicy": "Always"
                            }
                          ],
                          "restartPolicy": "Always",
                          "terminationGracePeriodSeconds": 30,
                          "dnsPolicy": "ClusterFirst",
                          "securityContext": {}
                        }
                      }
                    },
                    "status": {
                      "latestVersion": 1,
                      "details": {
                        "causes": [
                          {
                            "type": "ImageChange",
                            "imageTrigger": {
                              "from": {
                                "kind": "ImageStreamTag",
                                "name": "perly-white-things:latest"
                              }
                            }
                          }
                        ]
                      }
                    }
                  },
                  {
                    "metadata": {
                      "name": "php-stuff",
                      "namespace": "stuff-and-things",
                      "selfLink": "/oapi/v1/namespaces/stuff-and-things/deploymentconfigs/php-stuff",
                      "uid": "0cccd2a6-070f-11e6-81e2-080027c5bfa9",
                      "resourceVersion": "6204",
                      "creationTimestamp": "2016-04-20T15:46:30Z",
                      "labels": {
                        "app": "php-stuff"
                      },
                      "annotations": {
                        "openshift.io/generated-by": "OpenShiftWebConsole"
                      }
                    },
                    "spec": {
                      "strategy": {
                        "type": "Rolling",
                        "rollingParams": {
                          "updatePeriodSeconds": 1,
                          "intervalSeconds": 1,
                          "timeoutSeconds": 600,
                          "maxUnavailable": "25%",
                          "maxSurge": "25%"
                        },
                        "resources": {}
                      },
                      "triggers": [
                        {
                          "type": "ImageChange",
                          "imageChangeParams": {
                            "automatic": true,
                            "containerNames": [
                              "php-stuff"
                            ],
                            "from": {
                              "kind": "ImageStreamTag",
                              "name": "php-stuff:latest"
                            },
                            "lastTriggeredImage": "172.30.55.228:5000/stuff-and-things/php-stuff@sha256:e04ec2f712640c7585d0c37ec33bf1725a3a35d9f837996c5f795eb44aa5f255"
                          }
                        },
                        {
                          "type": "ConfigChange"
                        }
                      ],
                      "replicas": 4,
                      "test": false,
                      "selector": {
                        "deploymentconfig": "php-stuff"
                      },
                      "template": {
                        "metadata": {
                          "creationTimestamp": null,
                          "labels": {
                            "app": "php-stuff",
                            "deploymentconfig": "php-stuff"
                          }
                        },
                        "spec": {
                          "containers": [
                            {
                              "name": "php-stuff",
                              "image": "172.30.55.228:5000/stuff-and-things/php-stuff@sha256:e04ec2f712640c7585d0c37ec33bf1725a3a35d9f837996c5f795eb44aa5f255",
                              "ports": [
                                {
                                  "containerPort": 8080,
                                  "protocol": "TCP"
                                }
                              ],
                              "env": [
                                {
                                  "name": "PATH",
                                  "value": "/opt/app-root/src/bin:/opt/app-root/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/rh/rh-php56/root/usr/bin"
                                },
                                {
                                  "name": "STI_SCRIPTS_URL",
                                  "value": "image:///usr/libexec/s2i"
                                },
                                {
                                  "name": "STI_SCRIPTS_PATH",
                                  "value": "/usr/libexec/s2i"
                                },
                                {
                                  "name": "HOME",
                                  "value": "/opt/app-root/src"
                                },
                                {
                                  "name": "BASH_ENV",
                                  "value": "/opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "ENV",
                                  "value": "/opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "PROMPT_COMMAND",
                                  "value": ". /opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "PHP_VERSION",
                                  "value": "5.6"
                                }
                              ],
                              "resources": {},
                              "terminationMessagePath": "/dev/termination-log",
                              "imagePullPolicy": "Always"
                            }
                          ],
                          "restartPolicy": "Always",
                          "terminationGracePeriodSeconds": 30,
                          "dnsPolicy": "ClusterFirst",
                          "securityContext": {}
                        }
                      }
                    },
                    "status": {
                      "latestVersion": 3,
                      "details": {
                        "causes": [
                          {
                            "type": "ImageChange",
                            "imageTrigger": {
                              "from": {
                                "kind": "ImageStreamTag",
                                "name": "php-stuff:latest"
                              }
                            }
                          }
                        ]
                      }
                    }
                  },
                  {
                    "metadata": {
                      "name": "python-is-the-bomb",
                      "namespace": "stuff-and-things",
                      "selfLink": "/oapi/v1/namespaces/stuff-and-things/deploymentconfigs/python-is-the-bomb",
                      "uid": "0f4498f8-072a-11e6-81e2-080027c5bfa9",
                      "resourceVersion": "6245",
                      "creationTimestamp": "2016-04-20T18:59:50Z",
                      "labels": {
                        "app": "python-is-the-bomb"
                      },
                      "annotations": {
                        "openshift.io/generated-by": "OpenShiftWebConsole"
                      }
                    },
                    "spec": {
                      "strategy": {
                        "type": "Rolling",
                        "rollingParams": {
                          "updatePeriodSeconds": 1,
                          "intervalSeconds": 1,
                          "timeoutSeconds": 600,
                          "maxUnavailable": "25%",
                          "maxSurge": "25%"
                        },
                        "resources": {}
                      },
                      "triggers": [
                        {
                          "type": "ImageChange",
                          "imageChangeParams": {
                            "automatic": true,
                            "containerNames": [
                              "python-is-the-bomb"
                            ],
                            "from": {
                              "kind": "ImageStreamTag",
                              "name": "python-is-the-bomb:latest"
                            },
                            "lastTriggeredImage": "172.30.55.228:5000/stuff-and-things/python-is-the-bomb@sha256:f673f126be224d84ab13bdb51b41ea83450ba3eb54b225fe89b1a9dbc8bb024b"
                          }
                        },
                        {
                          "type": "ConfigChange"
                        }
                      ],
                      "replicas": 1,
                      "test": false,
                      "selector": {
                        "deploymentconfig": "python-is-the-bomb"
                      },
                      "template": {
                        "metadata": {
                          "creationTimestamp": null,
                          "labels": {
                            "app": "python-is-the-bomb",
                            "deploymentconfig": "python-is-the-bomb"
                          }
                        },
                        "spec": {
                          "containers": [
                            {
                              "name": "python-is-the-bomb",
                              "image": "172.30.55.228:5000/stuff-and-things/python-is-the-bomb@sha256:f673f126be224d84ab13bdb51b41ea83450ba3eb54b225fe89b1a9dbc8bb024b",
                              "ports": [
                                {
                                  "containerPort": 8080,
                                  "protocol": "TCP"
                                }
                              ],
                              "env": [
                                {
                                  "name": "PATH",
                                  "value": "/opt/app-root/src/.local/bin/:/opt/app-root/src/bin:/opt/app-root/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
                                },
                                {
                                  "name": "STI_SCRIPTS_URL",
                                  "value": "image:///usr/libexec/s2i"
                                },
                                {
                                  "name": "STI_SCRIPTS_PATH",
                                  "value": "/usr/libexec/s2i"
                                },
                                {
                                  "name": "HOME",
                                  "value": "/opt/app-root/src"
                                },
                                {
                                  "name": "BASH_ENV",
                                  "value": "/opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "ENV",
                                  "value": "/opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "PROMPT_COMMAND",
                                  "value": ". /opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "PYTHON_VERSION",
                                  "value": "2.7"
                                }
                              ],
                              "resources": {},
                              "terminationMessagePath": "/dev/termination-log",
                              "imagePullPolicy": "Always"
                            }
                          ],
                          "restartPolicy": "Always",
                          "terminationGracePeriodSeconds": 30,
                          "dnsPolicy": "ClusterFirst",
                          "securityContext": {}
                        }
                      }
                    },
                    "status": {
                      "latestVersion": 1,
                      "details": {
                        "causes": [
                          {
                            "type": "ImageChange",
                            "imageTrigger": {
                              "from": {
                                "kind": "ImageStreamTag",
                                "name": "python-is-the-bomb:latest"
                              }
                            }
                          }
                        ]
                      }
                    }
                  },
                  {
                    "metadata": {
                      "name": "wild-like-the-fly",
                      "namespace": "stuff-and-things",
                      "selfLink": "/oapi/v1/namespaces/stuff-and-things/deploymentconfigs/wild-like-the-fly",
                      "uid": "23669d49-072a-11e6-81e2-080027c5bfa9",
                      "resourceVersion": "6295",
                      "creationTimestamp": "2016-04-20T19:00:24Z",
                      "labels": {
                        "app": "wild-like-the-fly"
                      },
                      "annotations": {
                        "openshift.io/generated-by": "OpenShiftWebConsole"
                      }
                    },
                    "spec": {
                      "strategy": {
                        "type": "Rolling",
                        "rollingParams": {
                          "updatePeriodSeconds": 1,
                          "intervalSeconds": 1,
                          "timeoutSeconds": 600,
                          "maxUnavailable": "25%",
                          "maxSurge": "25%"
                        },
                        "resources": {}
                      },
                      "triggers": [
                        {
                          "type": "ImageChange",
                          "imageChangeParams": {
                            "automatic": true,
                            "containerNames": [
                              "wild-like-the-fly"
                            ],
                            "from": {
                              "kind": "ImageStreamTag",
                              "name": "wild-like-the-fly:latest"
                            },
                            "lastTriggeredImage": "172.30.55.228:5000/stuff-and-things/wild-like-the-fly@sha256:61b3886a42138761b025a9d8ca23c39c22900643d6d332a2ec72f22c9c3b85ea"
                          }
                        },
                        {
                          "type": "ConfigChange"
                        }
                      ],
                      "replicas": 1,
                      "test": false,
                      "selector": {
                        "deploymentconfig": "wild-like-the-fly"
                      },
                      "template": {
                        "metadata": {
                          "creationTimestamp": null,
                          "labels": {
                            "app": "wild-like-the-fly",
                            "deploymentconfig": "wild-like-the-fly"
                          }
                        },
                        "spec": {
                          "containers": [
                            {
                              "name": "wild-like-the-fly",
                              "image": "172.30.55.228:5000/stuff-and-things/wild-like-the-fly@sha256:61b3886a42138761b025a9d8ca23c39c22900643d6d332a2ec72f22c9c3b85ea",
                              "ports": [
                                {
                                  "containerPort": 8080,
                                  "protocol": "TCP"
                                }
                              ],
                              "env": [
                                {
                                  "name": "PATH",
                                  "value": "/opt/app-root/src/bin:/opt/app-root/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
                                },
                                {
                                  "name": "STI_SCRIPTS_URL",
                                  "value": "image:///usr/libexec/s2i"
                                },
                                {
                                  "name": "STI_SCRIPTS_PATH",
                                  "value": "/usr/libexec/s2i"
                                },
                                {
                                  "name": "HOME",
                                  "value": "/opt/app-root/src"
                                },
                                {
                                  "name": "BASH_ENV",
                                  "value": "/opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "ENV",
                                  "value": "/opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "PROMPT_COMMAND",
                                  "value": ". /opt/app-root/etc/scl_enable"
                                },
                                {
                                  "name": "WILDFLY_VERSION",
                                  "value": "10.0.0.Final"
                                },
                                {
                                  "name": "MAVEN_VERSION",
                                  "value": "3.3.3"
                                }
                              ],
                              "resources": {},
                              "terminationMessagePath": "/dev/termination-log",
                              "imagePullPolicy": "Always"
                            }
                          ],
                          "restartPolicy": "Always",
                          "terminationGracePeriodSeconds": 30,
                          "dnsPolicy": "ClusterFirst",
                          "securityContext": {}
                        }
                      }
                    },
                    "status": {
                      "latestVersion": 1,
                      "details": {
                        "causes": [
                          {
                            "type": "ImageChange",
                            "imageTrigger": {
                              "from": {
                                "kind": "ImageStreamTag",
                                "name": "wild-like-the-fly:latest"
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                ]
              });
            },
            getWithSpecialEnvs: function() {
              return $q.when({
                "kind": "PodList",
                "apiVersion": "v1",
                "metadata": {
                  "selfLink": "/api/v1/namespaces/special-envs/pods",
                  "resourceVersion": "1037"
                },
                "items": [
                  {
                    "metadata": {
                      "name": "config-cmd-test-pod",
                      "namespace": "special-envs",
                      "selfLink": "/api/v1/namespaces/special-envs/pods/config-cmd-test-pod",
                      "uid": "38fdf844-36fe-11e6-a049-080027c5bfa9",
                      "resourceVersion": "980",
                      "creationTimestamp": "2016-06-20T15:46:58Z",
                      "annotations": {
                        "openshift.io/scc": "restricted"
                      }
                    },
                    "spec": {
                      "volumes": [
                        {
                          "name": "default-token-mrp97",
                          "secret": {
                            "secretName": "default-token-mrp97"
                          }
                        }
                      ],
                      "containers": [
                        {
                          "name": "test-container",
                          "image": "gcr.io/google_containers/busybox",
                          "command": [
                            "/bin/sh",
                            "-c",
                            "echo $(KUBE_CONFIG_1) $(KUBE_CONFIG_2)"
                          ],
                          "env": [
                            {
                              "name": "KUBE_CONFIG_1",
                              "valueFrom": {
                                "configMapKeyRef": {
                                  "name": "test-configmap",
                                  "key": "data-1"
                                }
                              }
                            },
                            {
                              "name": "KUBE_CONFIG_2",
                              "valueFrom": {
                                "configMapKeyRef": {
                                  "name": "test-configmap",
                                  "key": "data-2"
                                }
                              }
                            }
                          ],
                          "resources": {},
                          "volumeMounts": [
                            {
                              "name": "default-token-mrp97",
                              "readOnly": true,
                              "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
                            }
                          ],
                          "terminationMessagePath": "/dev/termination-log",
                          "imagePullPolicy": "Always",
                          "securityContext": {
                            "capabilities": {
                              "drop": [
                                "KILL",
                                "MKNOD",
                                "SETGID",
                                "SETUID",
                                "SYS_CHROOT"
                              ]
                            },
                            "privileged": false,
                            "seLinuxOptions": {
                              "level": "s0:c7,c4"
                            },
                            "runAsUser": 1000050000
                          }
                        }
                      ],
                      "restartPolicy": "Never",
                      "terminationGracePeriodSeconds": 30,
                      "dnsPolicy": "ClusterFirst",
                      "host": "localhost.localdomain",
                      "serviceAccountName": "default",
                      "serviceAccount": "default",
                      "nodeName": "localhost.localdomain",
                      "securityContext": {
                        "seLinuxOptions": {
                          "level": "s0:c7,c4"
                        },
                        "fsGroup": 1000050000
                      },
                      "imagePullSecrets": [
                        {
                          "name": "default-dockercfg-n3dif"
                        }
                      ]
                    },
                    "status": {
                      "phase": "Pending",
                      "conditions": [
                        {
                          "type": "Ready",
                          "status": "False",
                          "lastProbeTime": null,
                          "lastTransitionTime": "2016-06-20T15:46:58Z",
                          "reason": "ContainersNotReady",
                          "message": "containers with unready status: [test-container]"
                        }
                      ],
                      "hostIP": "10.0.2.15",
                      "podIP": "172.17.0.16",
                      "startTime": "2016-06-20T15:46:58Z",
                      "containerStatuses": [
                        {
                          "name": "test-container",
                          "state": {
                            "waiting": {
                              "reason": "RunContainerError",
                              "message": "GenerateRunContainerOptions: configmaps \"test-configmap\" not found"
                            }
                          },
                          "lastState": {},
                          "ready": false,
                          "restartCount": 0,
                          "image": "gcr.io/google_containers/busybox",
                          "imageID": ""
                        }
                      ]
                    }
                  },
                  {
                    "metadata": {
                      "name": "config-env-test-pod",
                      "namespace": "special-envs",
                      "selfLink": "/api/v1/namespaces/special-envs/pods/config-env-test-pod",
                      "uid": "4080b7fb-36fe-11e6-a049-080027c5bfa9",
                      "resourceVersion": "992",
                      "creationTimestamp": "2016-06-20T15:47:11Z",
                      "annotations": {
                        "openshift.io/scc": "restricted"
                      }
                    },
                    "spec": {
                      "volumes": [
                        {
                          "name": "default-token-mrp97",
                          "secret": {
                            "secretName": "default-token-mrp97"
                          }
                        }
                      ],
                      "containers": [
                        {
                          "name": "test-container",
                          "image": "gcr.io/google_containers/busybox",
                          "command": [
                            "/bin/sh",
                            "-c",
                            "env"
                          ],
                          "env": [
                            {
                              "name": "KUBE_CONFIG_1",
                              "valueFrom": {
                                "secretKeyRef": {
                                  "name": "test-secret",
                                  "key": "data-1"
                                }
                              }
                            },
                            {
                              "name": "KUBE_CONFIG_2",
                              "valueFrom": {
                                "secretKeyRef": {
                                  "name": "test-secret",
                                  "key": "data-2"
                                }
                              }
                            }
                          ],
                          "resources": {},
                          "volumeMounts": [
                            {
                              "name": "default-token-mrp97",
                              "readOnly": true,
                              "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
                            }
                          ],
                          "terminationMessagePath": "/dev/termination-log",
                          "imagePullPolicy": "Always",
                          "securityContext": {
                            "capabilities": {
                              "drop": [
                                "KILL",
                                "MKNOD",
                                "SETGID",
                                "SETUID",
                                "SYS_CHROOT"
                              ]
                            },
                            "privileged": false,
                            "seLinuxOptions": {
                              "level": "s0:c7,c4"
                            },
                            "runAsUser": 1000050000
                          }
                        }
                      ],
                      "restartPolicy": "Never",
                      "terminationGracePeriodSeconds": 30,
                      "dnsPolicy": "ClusterFirst",
                      "host": "localhost.localdomain",
                      "serviceAccountName": "default",
                      "serviceAccount": "default",
                      "nodeName": "localhost.localdomain",
                      "securityContext": {
                        "seLinuxOptions": {
                          "level": "s0:c7,c4"
                        },
                        "fsGroup": 1000050000
                      },
                      "imagePullSecrets": [
                        {
                          "name": "default-dockercfg-n3dif"
                        }
                      ]
                    },
                    "status": {
                      "phase": "Pending",
                      "conditions": [
                        {
                          "type": "Ready",
                          "status": "False",
                          "lastProbeTime": null,
                          "lastTransitionTime": "2016-06-20T15:47:11Z",
                          "reason": "ContainersNotReady",
                          "message": "containers with unready status: [test-container]"
                        }
                      ],
                      "hostIP": "10.0.2.15",
                      "podIP": "172.17.0.17",
                      "startTime": "2016-06-20T15:47:11Z",
                      "containerStatuses": [
                        {
                          "name": "test-container",
                          "state": {
                            "waiting": {
                              "reason": "RunContainerError",
                              "message": "GenerateRunContainerOptions: configmaps \"test-configmap\" not found"
                            }
                          },
                          "lastState": {},
                          "ready": false,
                          "restartCount": 0,
                          "image": "gcr.io/google_containers/busybox",
                          "imageID": ""
                        }
                      ]
                    }
                  },
                  {
                    "metadata": {
                      "name": "dapi-test-pod",
                      "namespace": "special-envs",
                      "selfLink": "/api/v1/namespaces/special-envs/pods/dapi-test-pod",
                      "uid": "50658894-36fe-11e6-a049-080027c5bfa9",
                      "resourceVersion": "1032",
                      "creationTimestamp": "2016-06-20T15:47:37Z",
                      "annotations": {
                        "openshift.io/scc": "restricted"
                      }
                    },
                    "spec": {
                      "volumes": [
                        {
                          "name": "default-token-mrp97",
                          "secret": {
                            "secretName": "default-token-mrp97"
                          }
                        }
                      ],
                      "containers": [
                        {
                          "name": "test-container",
                          "image": "gcr.io/google_containers/busybox",
                          "command": [
                            "/bin/sh",
                            "-c",
                            "env"
                          ],
                          "env": [
                            {
                              "name": "MY_POD_NAME",
                              "valueFrom": {
                                "fieldRef": {
                                  "apiVersion": "v1",
                                  "fieldPath": "metadata.name"
                                }
                              }
                            },
                            {
                              "name": "MY_POD_NAMESPACE",
                              "valueFrom": {
                                "fieldRef": {
                                  "apiVersion": "v1",
                                  "fieldPath": "metadata.namespace"
                                }
                              }
                            },
                            {
                              "name": "MY_POD_IP",
                              "valueFrom": {
                                "fieldRef": {
                                  "apiVersion": "v1",
                                  "fieldPath": "status.podIP"
                                }
                              }
                            }
                          ],
                          "resources": {},
                          "volumeMounts": [
                            {
                              "name": "default-token-mrp97",
                              "readOnly": true,
                              "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
                            }
                          ],
                          "terminationMessagePath": "/dev/termination-log",
                          "imagePullPolicy": "Always",
                          "securityContext": {
                            "capabilities": {
                              "drop": [
                                "KILL",
                                "MKNOD",
                                "SETGID",
                                "SETUID",
                                "SYS_CHROOT"
                              ]
                            },
                            "privileged": false,
                            "seLinuxOptions": {
                              "level": "s0:c7,c4"
                            },
                            "runAsUser": 1000050000
                          }
                        }
                      ],
                      "restartPolicy": "Never",
                      "terminationGracePeriodSeconds": 30,
                      "dnsPolicy": "ClusterFirst",
                      "host": "localhost.localdomain",
                      "serviceAccountName": "default",
                      "serviceAccount": "default",
                      "nodeName": "localhost.localdomain",
                      "securityContext": {
                        "seLinuxOptions": {
                          "level": "s0:c7,c4"
                        },
                        "fsGroup": 1000050000
                      },
                      "imagePullSecrets": [
                        {
                          "name": "default-dockercfg-n3dif"
                        }
                      ]
                    },
                    "status": {
                      "phase": "Succeeded",
                      "conditions": [
                        {
                          "type": "Ready",
                          "status": "False",
                          "lastProbeTime": null,
                          "lastTransitionTime": "2016-06-20T15:47:37Z",
                          "reason": "PodCompleted"
                        }
                      ],
                      "hostIP": "10.0.2.15",
                      "startTime": "2016-06-20T15:47:37Z",
                      "containerStatuses": [
                        {
                          "name": "test-container",
                          "state": {
                            "terminated": {
                              "exitCode": 0,
                              "reason": "Completed",
                              "startedAt": "2016-06-20T15:47:39Z",
                              "finishedAt": "2016-06-20T15:47:39Z",
                              "containerID": "docker://e369bd61db3a4434728abd7a92012f3a4c5b4d44d974be4c824342b13b897d2d"
                            }
                          },
                          "lastState": {},
                          "ready": false,
                          "restartCount": 0,
                          "image": "gcr.io/google_containers/busybox",
                          "imageID": "docker://4986bf8c15363d1c5d15512d5266f8777bfba4974ac56e3270e7760f6f0a8125",
                          "containerID": "docker://e369bd61db3a4434728abd7a92012f3a4c5b4d44d974be4c824342b13b897d2d"
                        }
                      ]
                    }
                  },
                  {
                    "metadata": {
                      "name": "secret-env-pod",
                      "namespace": "special-envs",
                      "selfLink": "/api/v1/namespaces/special-envs/pods/secret-env-pod",
                      "uid": "484d3805-36fe-11e6-a049-080027c5bfa9",
                      "resourceVersion": "1008",
                      "creationTimestamp": "2016-06-20T15:47:24Z",
                      "annotations": {
                        "openshift.io/scc": "restricted"
                      }
                    },
                    "spec": {
                      "volumes": [
                        {
                          "name": "default-token-mrp97",
                          "secret": {
                            "secretName": "default-token-mrp97"
                          }
                        }
                      ],
                      "containers": [
                        {
                          "name": "test-container",
                          "image": "gcr.io/google_containers/busybox",
                          "command": [
                            "/bin/sh",
                            "-c",
                            "env"
                          ],
                          "env": [
                            {
                              "name": "MY_SECRET_DATA",
                              "valueFrom": {
                                "other": {
                                  "name": "test-secret",
                                  "key": "data-1"
                                }
                              }
                            }
                          ],
                          "resources": {},
                          "volumeMounts": [
                            {
                              "name": "default-token-mrp97",
                              "readOnly": true,
                              "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
                            }
                          ],
                          "terminationMessagePath": "/dev/termination-log",
                          "imagePullPolicy": "Always",
                          "securityContext": {
                            "capabilities": {
                              "drop": [
                                "KILL",
                                "MKNOD",
                                "SETGID",
                                "SETUID",
                                "SYS_CHROOT"
                              ]
                            },
                            "privileged": false,
                            "seLinuxOptions": {
                              "level": "s0:c7,c4"
                            },
                            "runAsUser": 1000050000
                          }
                        }
                      ],
                      "restartPolicy": "Never",
                      "terminationGracePeriodSeconds": 30,
                      "dnsPolicy": "ClusterFirst",
                      "host": "localhost.localdomain",
                      "serviceAccountName": "default",
                      "serviceAccount": "default",
                      "nodeName": "localhost.localdomain",
                      "securityContext": {
                        "seLinuxOptions": {
                          "level": "s0:c7,c4"
                        },
                        "fsGroup": 1000050000
                      },
                      "imagePullSecrets": [
                        {
                          "name": "default-dockercfg-n3dif"
                        }
                      ]
                    },
                    "status": {
                      "phase": "Pending",
                      "conditions": [
                        {
                          "type": "Ready",
                          "status": "False",
                          "lastProbeTime": null,
                          "lastTransitionTime": "2016-06-20T15:47:24Z",
                          "reason": "ContainersNotReady",
                          "message": "containers with unready status: [test-container]"
                        }
                      ],
                      "hostIP": "10.0.2.15",
                      "podIP": "172.17.0.18",
                      "startTime": "2016-06-20T15:47:24Z",
                      "containerStatuses": [
                        {
                          "name": "test-container",
                          "state": {
                            "waiting": {
                              "reason": "RunContainerError",
                              "message": "GenerateRunContainerOptions: secrets \"test-secret\" not found"
                            }
                          },
                          "lastState": {},
                          "ready": false,
                          "restartCount": 0,
                          "image": "gcr.io/google_containers/busybox",
                          "imageID": ""
                        }
                      ]
                    }
                  }
                ]
              });
            }
          }
        }
      ]);
})();
