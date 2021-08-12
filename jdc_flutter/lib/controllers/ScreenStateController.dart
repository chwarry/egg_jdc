import 'package:flutter/material.dart';
import 'package:sp_util/sp_util.dart';

class ScreenStateController extends ChangeNotifier {
  int _screentIndex = 0;
  int get screentIndex => _screentIndex;

  void setScreenIndex(int index) {
    _screentIndex = index;
    notifyListeners();
  }

  String _qrCode = "";
  String get qrCode => _qrCode;

  void setQrcode(String qrcode) {
    _qrCode = qrcode;
    notifyListeners();
  }

  String? _eid = SpUtil.getString("key");
  String? get eid => _eid;

  void setEid(String str) {
    _eid = str;
    notifyListeners();
  }
}
