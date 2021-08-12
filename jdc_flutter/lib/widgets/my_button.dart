import 'package:flutter/material.dart';
import 'package:jdc/constants.dart';
import 'package:jdc/res/gaps.dart';

class MyButton extends StatelessWidget {
  const MyButton({
    Key? key,
    this.text = '',
    this.fontSize = 14.0,
    this.height = 48,
    this.width = double.infinity,
    required this.onPressed,
  }) : super(key: key);

  final String text;
  final double fontSize;
  final VoidCallback onPressed;
  final double height;
  final double width;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: ElevatedButton(
        child: Text(
          '点击扫码登陆',
          style: TextStyle(fontSize: Dimens.font_sp18),
        ),
        style: ButtonStyle(
            shape: MaterialStateProperty.all<OutlinedBorder>(RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0))),
            backgroundColor: MaterialStateProperty.all(secondaryColor),
            textStyle: MaterialStateProperty.all<TextStyle>(TextStyle(color: primaryColor, fontSize: fontSize))),
        onPressed: onPressed,
      ),
    );
  }
}
