import 'package:flutter/material.dart';

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
}
