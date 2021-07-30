import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:jdc/controllers/ScreenStateController.dart';
import 'package:jdc/util/store.dart';

class SideMenu extends StatefulWidget {
  const SideMenu({
    Key? key,
  }) : super(key: key);

  @override
  _SideMenuState createState() => _SideMenuState();
}

class _SideMenuState extends State<SideMenu> {
  ScreenStateController? screenStateController;

  @override
  void initState() {
    screenStateController = Store.value<ScreenStateController>(context);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          DrawerHeader(
            child: Image.asset("assets/images/logo.png"),
          ),
          DrawerListTile(
            title: "运行面板",
            svgSrc: "assets/icons/menu_dashbord.svg",
            press: () {
              screenStateController!.setScreenIndex(0);
            },
          ),
          DrawerListTile(
            title: "扫码",
            svgSrc: "assets/icons/menu_store.svg",
            press: () {
              screenStateController!.setScreenIndex(1);
            },
          ),
          DrawerListTile(
            title: "任务列表",
            svgSrc: "assets/icons/menu_task.svg",
            press: () {
              screenStateController!.setScreenIndex(2);
            },
          ),
          DrawerListTile(
            title: "京豆变化",
            svgSrc: "assets/icons/menu_profile.svg",
            press: () {
              screenStateController!.setScreenIndex(3);
            },
          ),
          // DrawerListTile(
          //   title: "Notification",
          //   svgSrc: "assets/icons/menu_notification.svg",
          //   press: () {},
          // ),
          // DrawerListTile(
          //   title: "Profile",
          //   svgSrc: "assets/icons/menu_profile.svg",
          //   press: () {},
          // ),
          DrawerListTile(
            title: "设置",
            svgSrc: "assets/icons/menu_setting.svg",
            press: () {
              screenStateController!.setScreenIndex(4);
            },
          ),
        ],
      ),
    );
  }
}

class DrawerListTile extends StatelessWidget {
  const DrawerListTile({
    Key? key,
    // For selecting those three line once press "Command+D"
    required this.title,
    required this.svgSrc,
    required this.press,
  }) : super(key: key);

  final String title, svgSrc;
  final VoidCallback press;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: press,
      horizontalTitleGap: 0.0,
      leading: SvgPicture.asset(
        svgSrc,
        color: Colors.white54,
        height: 16,
      ),
      title: Text(
        title,
        style: TextStyle(color: Colors.white54),
      ),
    );
  }
}
