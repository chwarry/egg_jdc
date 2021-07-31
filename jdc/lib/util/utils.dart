import 'package:jdc/util/toast.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class Utils {
  /// 调起拨号页
  static void launchTelURL(String phone) async {
    final String url = 'tel:' + phone;
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      Toast.show('拨号失败！');
    }
  }

  /// 调起二维码扫描页
  // static Future<String> scan() async {
  //   try {
  //     const ScanOptions options = ScanOptions(
  //       strings: {
  //         'cancel': '取消',
  //         'flash_on': '开启闪光灯',
  //         'flash_off': '关闭闪光灯',
  //       },
  //     );
  //     final ScanResult result = await BarcodeScanner.scan(options: options);
  //     return result.rawContent;
  //   } catch (e) {
  //     if (e is PlatformException) {
  //       if (e.code == BarcodeScanner.cameraAccessDenied) {
  //         Toast.show('没有相机权限！');
  //       }
  //     }
  //   }
  //   return null;
  // }

}

Future showElasticDialog({
  required BuildContext context,
  bool barrierDismissible = true,
  required WidgetBuilder builder,
}) {
  final ThemeData theme = Theme.of(context);
  return showGeneralDialog(
    context: context,
    pageBuilder: (BuildContext buildContext, Animation<double> animation, Animation<double> secondaryAnimation) {
      final Widget pageChild = Builder(builder: builder);
      return SafeArea(
        child: Builder(builder: (BuildContext context) {
          return theme != null ? Theme(data: theme, child: pageChild) : pageChild;
        }),
      );
    },
    barrierDismissible: barrierDismissible,
    barrierLabel: MaterialLocalizations.of(context).modalBarrierDismissLabel,
    barrierColor: Colors.black54,
    transitionDuration: const Duration(milliseconds: 550),
    transitionBuilder: _buildDialogTransitions,
  );
}

Widget _buildDialogTransitions(BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
  return FadeTransition(
    opacity: CurvedAnimation(
      parent: animation,
      curve: Curves.easeOut,
    ),
    child: SlideTransition(
      position: Tween<Offset>(begin: const Offset(0.0, 0.3), end: Offset.zero).animate(CurvedAnimation(
        parent: animation,
        curve: const ElasticOutCurve(0.85),
        reverseCurve: Curves.easeOutBack,
      )),
      child: child,
    ),
  );
}
