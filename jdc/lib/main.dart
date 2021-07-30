import 'package:flutter/services.dart';
import 'package:jdc/constants.dart';
import 'package:jdc/routes/404.dart';
import 'package:jdc/routes/application.dart';
import 'package:jdc/routes/routers.dart';
import 'package:jdc/util/log_utils.dart';
import 'package:jdc/util/store.dart';
import 'package:oktoast/oktoast.dart';
import 'package:dio/dio.dart';
import 'package:fluro/fluro.dart';
import 'package:jdc/screens/main/main_screen.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:sp_util/sp_util.dart';

import 'net/dio_utils.dart';
import 'net/intercept.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SpUtil.getInstance();

  runApp(Store.init(MyApp()));
  SystemChrome.setEnabledSystemUIOverlays([SystemUiOverlay.bottom]);
}

class MyApp extends StatelessWidget {
  MyApp() {
    Log.init();
    initDio();

    final FluroRouter router = FluroRouter();
    Routes.configureRoutes(router);
    Application.router = router;
  }

  void initDio() async {
    final List<Interceptor> interceptors = [];

    /// 打印Log(生产模式去除)
    if (!inProduction) {
      interceptors.add(LoggingInterceptor());
    }

    setInitDio(
      //adb kill-server && adb server && adb shell
      baseUrl: inProduction ? 'http://192.168.1.118:9998' : 'http://192.168.1.118:9998',
      interceptors: interceptors,
    );
  }

  @override
  Widget build(BuildContext context) {
    return OKToast(
        child: MaterialApp(
          title: '京东助手',
          theme: ThemeData.dark().copyWith(
            scaffoldBackgroundColor: bgColor,
            textTheme: GoogleFonts.poppinsTextTheme(Theme.of(context).textTheme).apply(bodyColor: Colors.white),
            canvasColor: secondaryColor,
          ),
          home: MainScreen(),
          onGenerateRoute: Application.router!.generator,
          builder: (context, child) {
            /// 保证文字大小不受手机系统设置影响 https://www.kikt.top/posts/flutter/layout/dynamic-text/
            return MediaQuery(
              data: MediaQuery.of(context)
                  .copyWith(textScaleFactor: 1.0), // 或者 MediaQueryData.fromWindow(WidgetsBinding.instance.window).copyWith(textScaleFactor: 1.0),
              child: child!,
            );
          },

          /// 因为使用了fluro，这里设置主要针对Web
          onUnknownRoute: (_) {
            return MaterialPageRoute(
              builder: (BuildContext context) => PageNotFound(),
            );
          },
        ),

        /// Toast 配置
        backgroundColor: Colors.black54,
        textPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
        radius: 20.0,
        position: ToastPosition.bottom);
  }
}
