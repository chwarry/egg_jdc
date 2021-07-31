import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'package:jdc/constants.dart';
import 'package:jdc/controllers/ScreenStateController.dart';
import 'package:jdc/models/node_list_model.dart';
import 'package:jdc/util/toast.dart';
import 'package:jdc/util/utils.dart';
import 'package:jdc/widgets/load_image.dart';
import 'package:jdc/widgets/my_button.dart';
import 'package:provider/provider.dart';

class NodeInfoCard extends StatelessWidget {
  const NodeInfoCard({
    Key? key,
    required this.info,
  }) : super(key: key);

  final NodeListModel info;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        //弹窗扫码
        GlobalKey jdsaoma = GlobalKey();
        showElasticDialog(
          context: context,
          builder: (BuildContext context) {
            return Material(
              type: MaterialType.transparency,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    RepaintBoundary(
                      key: jdsaoma,
                      child: Selector<ScreenStateController, String>(
                          builder: (_, qrcode, __) {
                            return qrcode != ""
                                ? Container(
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                    ),
                                    width: 300,
                                    height: 350,
                                    child: Column(
                                      children: <Widget>[
                                        LoadImage(
                                          qrcode,
                                          height: 350,
                                          width: 400,
                                          // width: ,
                                          fit: BoxFit.fitWidth,
                                        ),
                                      ],
                                    ),
                                  )
                                : Container();
                          },
                          selector: (_, store) => store.qrCode),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        MyButton(
                          text: '点击扫码登陆',
                          onPressed: () async {},
                        ),
                        MyButton(
                          text: '进入京东app登陆',
                          onPressed: () async {},
                        ),
                      ],
                    )
                  ],
                ),
              ),
            );
          },
        );
      },
      child: Container(
        padding: EdgeInsets.all(defaultPadding),
        decoration: BoxDecoration(
          color: secondaryColor,
          borderRadius: const BorderRadius.all(Radius.circular(10)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: EdgeInsets.all(defaultPadding * 0.75),
                  height: 40,
                  width: 40,
                  decoration: BoxDecoration(
                    color: Color(0xFFA4CDFF).withOpacity(0.1),
                    borderRadius: const BorderRadius.all(Radius.circular(10)),
                  ),
                  child: SvgPicture.asset(
                    "assets/icons/one_drive.svg",
                    color: Color(0xFFA4CDFF),
                  ),
                ),
                // Icon(Icons.more_vert, color: Colors.white54)
              ],
            ),
            Text(
              info.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            ProgressLine(
              color: Color(0xFFA4CDFF),
              percentage: info.marginCount / info.allCount,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "已使用:${info.marginCount} ",
                  style: Theme.of(context).textTheme.caption!.copyWith(color: Colors.white70),
                ),
                Text(
                  "总共:${info.allCount}",
                  style: Theme.of(context).textTheme.caption!.copyWith(color: Colors.white),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}

class ProgressLine extends StatelessWidget {
  const ProgressLine({
    Key? key,
    this.color = primaryColor,
    required this.percentage,
  }) : super(key: key);

  final Color? color;
  final double? percentage;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          width: double.infinity,
          height: 5,
          decoration: BoxDecoration(
            color: color!.withOpacity(0.1),
            borderRadius: BorderRadius.all(Radius.circular(10)),
          ),
        ),
        LayoutBuilder(
          builder: (context, constraints) => Container(
            width: constraints.maxWidth * percentage!,
            height: 5,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.all(Radius.circular(10)),
            ),
          ),
        ),
      ],
    );
  }
}
