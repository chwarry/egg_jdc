import 'package:flutter/material.dart';

import '../../../constants.dart';
import 'storage_info_card.dart';

class StarageDetails extends StatelessWidget {
  const StarageDetails({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(defaultPadding),
      decoration: BoxDecoration(
        color: secondaryColor,
        borderRadius: const BorderRadius.all(Radius.circular(10)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "公告内容",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(height: defaultPadding),
          Text(
            "本项目开源,如果收费,请删除",
            style: TextStyle(color: Colors.redAccent),
          ),
          SizedBox(height: defaultPadding),
          StorageInfoCard(
            svgSrc: "assets/icons/doc_file.svg",
            title: "github地址",
            url: "https://github.com/xiaojia21190/egg_jdc",
          ),
        ],
      ),
    );
  }
}
