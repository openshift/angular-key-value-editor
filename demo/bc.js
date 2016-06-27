(function() {
  'use strict';

  angular
    .module('demo')
    .factory('bc', [
      '$q',
      function($q) {
        return {
          get: function() {
            return $q.when({
              "kind": "BuildConfigList",
              "apiVersion": "v1",
              "metadata": {
                "selfLink": "/oapi/v1/namespaces/rubies/buildconfigs",
                "resourceVersion": "6179"
              },
              "items": [
                {
                  "metadata": {
                    "name": "ruby-sample-build",
                    "namespace": "rubies",
                    "selfLink": "/oapi/v1/namespaces/rubies/buildconfigs/ruby-sample-build",
                    "uid": "3c95553c-36f8-11e6-a048-080027c5bfa9",
                    "resourceVersion": "501",
                    "creationTimestamp": "2016-06-20T15:04:07Z",
                    "labels": {
                      "name": "ruby-sample-build",
                      "template": "application-template-stibuild"
                    }
                  },
                  "spec": {
                    "triggers": [
                      {
                        "type": "GitHub",
                        "github": {
                          "secret": "secret101"
                        }
                      },
                      {
                        "type": "Generic",
                        "generic": {
                          "secret": "secret101"
                        }
                      },
                      {
                        "type": "ImageChange",
                        "imageChange": {
                          "lastTriggeredImageID": "centos/ruby-22-centos7@sha256:e563afa6ad4c5308ce3d26fd8a77424fc872f34cf206463b9dc454bd68d4ee50"
                        }
                      },
                      {
                        "type": "ConfigChange"
                      }
                    ],
                    "runPolicy": "Serial",
                    "source": {
                      "type": "Git",
                      "git": {
                        "uri": "https://github.com/openshift/ruby-hello-world.git"
                      },
                      "secrets": null
                    },
                    "strategy": {
                      "type": "Source",
                      "sourceStrategy": {
                        "from": {
                          "kind": "ImageStreamTag",
                          "name": "ruby-22-centos7:latest"
                        },
                        "env": [
                          {
                            "name": "EXAMPLE",
                            "value": "sample-app"
                          }
                        ]
                      }
                    },
                    "output": {
                      "to": {
                        "kind": "ImageStreamTag",
                        "name": "origin-ruby-sample:latest"
                      }
                    },
                    "resources": {},
                    "postCommit": {
                      "args": [
                        "bundle",
                        "exec",
                        "rake",
                        "test"
                      ]
                    }
                  },
                  "status": {
                    "lastVersion": 1
                  }
                }
              ]
            });
          }
        }
      }
    ]);
})();
