- !!! Some data needs to be built manually in advance, so FIRST:
  - concerning the VON network: issue "./manage build" command in "proj_root/von_network" ; when it's finished, then start von network : ./manage up (needed "up" for next step)
  - for agents/controllers : "./run_demo webstart -l" in "proj_root/docker" folder - will build but also START, so at the end:
               Just shut down everything again :
               - ./run_demo webdown in "docker" folder
               - ./manage down in "von_network" folder
  - PayIDServer doesn't need to be built in advance because it is last to be started anyway

- now you can run the start/stop scripts from the project root