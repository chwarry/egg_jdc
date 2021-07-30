import 'package:json_annotation/json_annotation.dart';

part 'node_list_model.g.dart';

@JsonSerializable()
class NodeListModel extends Object {
  @JsonKey(name: 'marginCount')
  int marginCount;

  @JsonKey(name: 'allowAdd')
  bool allowAdd;

  @JsonKey(name: 'allCount')
  int allCount;

  @JsonKey(name: 'url')
  String url;

  @JsonKey(name: 'name')
  String name;

  NodeListModel(
    this.marginCount,
    this.allowAdd,
    this.allCount,
    this.url,
    this.name,
  );

  factory NodeListModel.fromJson(Map<String, dynamic> srcJson) => _$NodeListModelFromJson(srcJson);

  Map<String, dynamic> toJson() => _$NodeListModelToJson(this);
}
