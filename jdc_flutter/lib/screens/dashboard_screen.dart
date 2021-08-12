import 'package:jdc/components/my_node_list.dart';
import 'package:flutter/material.dart';
import 'package:jdc/components/storage_details.dart';

import 'package:jdc/constants.dart';
import 'package:jdc/components/header.dart';
import 'package:jdc/controllers/ScreenStateController.dart';
import 'package:jdc/responsive.dart';
import 'package:provider/provider.dart';
import 'package:sp_util/sp_util.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String eid = "";
  String nickname = "";
  String sa = "";

  @override
  void initState() {
    eid = SpUtil.getString("key")!;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: EdgeInsets.all(defaultPadding),
        child: Column(
          children: [
            Header(),
            SizedBox(height: defaultPadding),
            Selector<ScreenStateController, String?>(
                builder: (_, eid, __) {
                  return eid == ""
                      ? Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (!Responsive.isMobile(context))
                              Expanded(
                                flex: 2,
                                child: StarageDetails(),
                              ),
                            if (!Responsive.isMobile(context)) SizedBox(width: defaultPadding),
                            // On Mobile means if the screen is less than 850 we dont want to show it
                            Expanded(
                              flex: 5,
                              child: Column(
                                children: [
                                  if (Responsive.isMobile(context)) StarageDetails(),
                                  if (Responsive.isMobile(context)) SizedBox(height: defaultPadding),
                                  // SizedBox(height: defaultPadding),
                                  MyNodeList(),
                                  // RecentFiles(),
                                ],
                              ),
                            ),
                          ],
                        )
                      : Center(
                          child: Text("已登录"),
                        );
                },
                selector: (_, store) => store.eid),
          ],
        ),
      ),
    );
  }
}
