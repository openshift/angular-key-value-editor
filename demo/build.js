(function() {
  'use strict';

  angular
    .module('demo')
    .factory('build', [
      '$q',
      function($q) {
        return {
          get: function() {
            return $q.when({
              "kind": "BuildList",
              "apiVersion": "v1",
              "metadata": {
                "selfLink": "/oapi/v1/namespaces/rubies/builds",
                "resourceVersion": "6179"
              },
              "items": [
                {
                  "metadata": {
                    "name": "ruby-sample-build-1",
                    "namespace": "rubies",
                    "selfLink": "/oapi/v1/namespaces/rubies/builds/ruby-sample-build-1",
                    "uid": "3ce7873a-36f8-11e6-a049-080027c5bfa9",
                    "resourceVersion": "611",
                    "creationTimestamp": "2016-06-20T15:04:08Z",
                    "labels": {
                      "buildconfig": "ruby-sample-build",
                      "name": "ruby-sample-build",
                      "openshift.io/build-config.name": "ruby-sample-build",
                      "openshift.io/build.start-policy": "Serial",
                      "template": "application-template-stibuild"
                    },
                    "annotations": {
                      "openshift.io/build-config.name": "ruby-sample-build",
                      "openshift.io/build.number": "1",
                      "openshift.io/build.pod-name": "ruby-sample-build-1-build"
                    }
                  },
                  "spec": {
                    "serviceAccount": "builder",
                    "source": {
                      "type": "Git",
                      "git": {
                        "uri": "https://github.com/openshift/ruby-hello-world.git"
                      },
                      "secrets": null
                    },
                    "revision": {
                      "type": "Git",
                      "git": {
                        "commit": "e79d8870be808a7abb4ab304e94c8bee69d909c6",
                        "author": {
                          "name": "Ben Parees",
                          "email": "bparees@users.noreply.github.com"
                        },
                        "committer": {
                          "name": "Ben Parees",
                          "email": "bparees@users.noreply.github.com"
                        },
                        "message": "Merge pull request #53 from danmcp/master"
                      }
                    },
                    "strategy": {
                      "type": "Source",
                      "sourceStrategy": {
                        "from": {
                          "kind": "DockerImage",
                          "name": "centos/ruby-22-centos7@sha256:e563afa6ad4c5308ce3d26fd8a77424fc872f34cf206463b9dc454bd68d4ee50"
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
                      },
                      "pushSecret": {
                        "name": "builder-dockercfg-6udq4"
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
                    },
                    "triggeredBy": [
                      {
                        "message": "Image change",
                        "imageChangeBuild": {
                          "imageID": "centos/ruby-22-centos7@sha256:e563afa6ad4c5308ce3d26fd8a77424fc872f34cf206463b9dc454bd68d4ee50",
                          "fromRef": {
                            "kind": "ImageStreamTag",
                            "name": "ruby-22-centos7:latest"
                          }
                        }
                      }
                    ]
                  },
                  "status": {
                    "phase": "Complete",
                    "startTimestamp": "2016-06-20T15:04:11Z",
                    "completionTimestamp": "2016-06-20T15:07:33Z",
                    "duration": 202000000000,
                    "outputDockerImageReference": "172.30.71.167:5000/rubies/origin-ruby-sample:latest",
                    "config": {
                      "kind": "BuildConfig",
                      "namespace": "rubies",
                      "name": "ruby-sample-build"
                    }
                  }
                }
              ]
            });
          }
        };
      }
    ]);
})();
