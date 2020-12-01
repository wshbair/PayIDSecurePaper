==================================
1
==================================
To start von network, in von network folder:
./manage build
./manage up

stop von network
./manage down
==================================
2
=============
      
To start agents and controllers, in project_root/docker folder:
./run_demo webstart -l

To stop agents and controllers, in project_root/docker folder:
./run_demo webdown
==================================
3
==========================
To start PayID server in containers, in project_root/PayID_server folder:
npm run devEnvUp


To stop PayID server in containers, in project_root/PayID_server folder:
npm run devDown

=========================


The dockerization code should take care that all controllers are in the "von_von" network