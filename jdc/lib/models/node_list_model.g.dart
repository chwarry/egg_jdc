// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'node_list_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

NodeListModel _$NodeListModelFromJson(Map<String, dynamic> json) {
  return NodeListModel(
    json['marginCount'] as int,
    json['allowAdd'] as bool,
    json['allCount'] as int,
    json['url'] as String,
    json['name'] as String,
  );
}

Map<String, dynamic> _$NodeListModelToJson(NodeListModel instance) =>
    <String, dynamic>{
      'marginCount': instance.marginCount,
      'allowAdd': instance.allowAdd,
      'allCount': instance.allCount,
      'url': instance.url,
      'name': instance.name,
    };
