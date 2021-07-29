import 'package:flutter/material.dart';

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
    return TextButton(
      onPressed: onPressed,
      style: ButtonStyle(shape: MaterialStateProperty.all<OutlinedBorder>(RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)))),
      child: Container(
        height: this.height,
        width: this.width,
        alignment: Alignment.center,
        child: Text(
          text,
          style: TextStyle(
            fontSize: this.fontSize,
          ),
        ),
      ),
    );
  }
}
