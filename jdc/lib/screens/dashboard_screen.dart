import 'package:jdc/components/my_node_list.dart';
import 'package:flutter/material.dart';
import 'package:jdc/components/storage_details.dart';

import 'package:jdc/constants.dart';
import 'package:jdc/components/header.dart';
import 'package:jdc/responsive.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: EdgeInsets.all(defaultPadding),
        child: Column(
          children: [
            Header(),
            SizedBox(height: defaultPadding),
            Row(
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
          ],
        ),
      ),
    );
  }
}
