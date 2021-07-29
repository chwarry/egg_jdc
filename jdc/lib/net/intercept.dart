import 'package:jdc/net/net.dart';
import 'package:dio/dio.dart';
import 'package:jdc/util/log_utils.dart';

import 'error_handle.dart';

class LoggingInterceptor extends Interceptor {
  DateTime? _startTime;
  DateTime? _endTime;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    _startTime = DateTime.now();
    Log.d('----------Start----------');
    if (options.queryParameters.isEmpty) {
      Log.d('RequestUrl: ' + options.baseUrl + options.path);
    } else {
      Log.d('RequestUrl: ' + options.baseUrl + options.path + '?' + Transformer.urlEncodeMap(options.queryParameters));
    }
    Log.d('RequestMethod: ' + options.method);
    Log.d('RequestHeaders:' + options.headers.toString());
    Log.d('RequestContentType: ${options.contentType}');
    Log.d('RequestData: ${options.data.toString()}');
    return super.onRequest(options, handler);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    _endTime = DateTime.now();
    int duration = _endTime!.difference(_startTime!).inMilliseconds;
    if (response.statusCode == ExceptionHandle.success) {
      Log.d('ResponseCode: ${response.statusCode}');
    } else {
      Log.e('ResponseCode: ${response.statusCode}');
    }
    // 输出结果
    Log.json(response.data.toString());
    Log.d('----------End: $duration 毫秒----------');
    return super.onResponse(response, handler);
  }

  @override
  void onError(DioError err, ErrorInterceptorHandler handler) {
    Log.d('----------Error-----------');
    return super.onError(err, handler);
  }
}
