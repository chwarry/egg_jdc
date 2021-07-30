import 'package:flutter/material.dart';
import 'package:jdc/controllers/AppStateController.dart';
import 'package:jdc/controllers/ScreenStateController.dart';
import 'package:provider/provider.dart';

class Store {
  Store._internal();

  //全局初始化
  static init(Widget child) {
    //多个Provider
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AppStateController>(
          create: (_) => AppStateController(),
          lazy: false,
        ),
        ChangeNotifierProvider<ScreenStateController>(
          create: (_) => ScreenStateController(),
          lazy: false,
        ),
      ],
      child: child,
    );
  }

  //获取值 context.read
  static T value<T>(BuildContext context) {
    return context.read<T>();
  }

  //监听值-获取值 context.watch
  static T watch<T>(BuildContext context) {
    return context.watch<T>();
  }
}
