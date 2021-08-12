import 'package:jdc/controllers/AppStateController.dart';
import 'package:jdc/controllers/ScreenStateController.dart';
import 'package:jdc/responsive.dart';
import 'package:jdc/screens/bean_page.dart';
import 'package:jdc/screens/dashboard_screen.dart';
import 'package:flutter/material.dart';
import 'package:jdc/screens/task_page.dart';
import 'package:jdc/screens/user_page.dart';
import 'package:jdc/util/store.dart';
import 'package:provider/provider.dart';

import 'package:jdc/components/side_menu.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  ScreenStateController? screenStateController;

  @override
  void initState() {
    screenStateController = Store.value<ScreenStateController>(context);
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: context.read<AppStateController>().scaffoldKey,
      drawer: SideMenu(),
      body: SafeArea(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // We want this side menu only for large screen
            if (Responsive.isDesktop(context))
              Expanded(
                // default flex = 1
                // and it takes 1/6 part of the screen
                child: SideMenu(),
              ),
            Expanded(
              // It takes 5/6 part of the screen
              flex: 5,
              child: Selector<ScreenStateController, int>(
                  builder: (_, index, __) {
                    if (index == 1) {
                      return UserPage();
                    } else if (index == 2) {
                      return TaskPage();
                    } else if (index == 3) {
                      return BeanPage();
                    }
                    return DashboardScreen();
                  },
                  selector: (_, store) => store.screentIndex),
            ),
          ],
        ),
      ),
    );
  }
}
