import 'package:jdc/routes/router_init.dart';
import 'package:fluro/fluro.dart';
import 'package:jdc/screens/bean_page.dart';
import 'package:jdc/screens/cookie_manager_page.dart';
import 'package:jdc/screens/saoma_page.dart';
import 'package:jdc/screens/task_page.dart';
import 'package:jdc/screens/user_page.dart';

class ScreenRouter implements IRouterProvider {
  static String userPage = '/user';
  static String saomaPage = '/saoma';
  static String taskPage = '/task';
  static String beanPage = '/bean';
  static String cookieManagerPage = '/cookieManager';

  @override
  void initRouter(FluroRouter router) {
    router.define(userPage, handler: Handler(handlerFunc: (_, __) => UserPage()));
    router.define(saomaPage, handler: Handler(handlerFunc: (_, params) => SaoMaPage()));
    router.define(taskPage, handler: Handler(handlerFunc: (_, params) => TaskPage()));
    router.define(beanPage, handler: Handler(handlerFunc: (_, params) => BeanPage()));
    router.define(cookieManagerPage, handler: Handler(handlerFunc: (_, params) => CookieMangerPage()));
  }
}
