import 'package:flutter/services.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:jdc/constants.dart';
import 'package:jdc/routes/404.dart';
import 'package:jdc/routes/application.dart';
import 'package:jdc/routes/routers.dart';
import 'package:jdc/util/handle_error_utils.dart';
import 'package:jdc/util/log_utils.dart';
import 'package:jdc/util/store.dart';
// import 'package:oktoast/oktoast.dart';
import 'package:dio/dio.dart';
import 'package:fluro/fluro.dart';
import 'package:jdc/screens/main_screen.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:jdc/util/toast.dart';
import 'package:sp_util/sp_util.dart';

import 'net/dio_utils.dart';
import 'net/intercept.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SpUtil.getInstance();

  handleError(runApp(Store.init(MyApp())));
  SystemChrome.setEnabledSystemUIOverlays([SystemUiOverlay.bottom]);
}

class MyApp extends StatelessWidget {
  MyApp() {
    Log.init();
    initDio();
    Toast.initLoadingToast();

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

    configDio(
      //adb kill-server && adb server && adb shell
      baseUrl: inProduction ? 'http://127.0.0.1:9998' : 'http://127.0.0.1:9998',
      interceptors: interceptors,
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '京东助手',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: bgColor,
        textTheme: GoogleFonts.poppinsTextTheme(Theme.of(context).textTheme).apply(bodyColor: Colors.white),
        canvasColor: secondaryColor,
      ),
      home: MainScreen(),
      onGenerateRoute: Application.router!.generator,
      builder: EasyLoading.init(),

      /// 因为使用了fluro，这里设置主要针对Web
      onUnknownRoute: (_) {
        return MaterialPageRoute(
          builder: (BuildContext context) => PageNotFound(),
        );
      },
    );
  }
}
